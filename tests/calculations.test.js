import test from "node:test";
import assert from "node:assert/strict";
import {
  estimatePercentage, dailyGrams, computeEnergy, buildPlan, validateProfile,
  resolvePercentage, distributeIngredients, sumMacros, missingGroups, LIMITS
} from "../src/calculations.js";
import { ingredientGroups } from "../src/ingredients.js";

const allIds = new Set(ingredientGroups.flatMap(group => group.items.map(item => item.id)));

test("adult interpolation is continuous and non-increasing before adjustments", () => {
  let previous = estimatePercentage({weightKg:1,neutered:"no",activity:"moderate"});
  for (let weight = 1.1; weight <= 100.0001; weight += .1) {
    const current = estimatePercentage({weightKg:weight,neutered:"no",activity:"moderate"});
    assert.ok(current <= previous + 1e-9, `percentage increased at ${weight} kg`);
    assert.ok(Math.abs(current-previous) <= .3 + 1e-9, `jump exceeded 0.3 at ${weight} kg`);
    previous = current;
  }
});

test("adult estimate validates enums and range boundaries", () => {
  assert.throws(() => estimatePercentage({weightKg:8,neutered:"banana"}), RangeError);
  assert.throws(() => estimatePercentage({weightKg:8,activity:"extreme"}), RangeError);
  for (const weightKg of [3,5,10,35]) {
    assert.ok(Number.isFinite(estimatePercentage({weightKg})));
  }
  assert.throws(() => estimatePercentage({weightKg:.49}), RangeError);
  assert.throws(() => estimatePercentage({weightKg:120.1}), RangeError);
});

test("puppy percentage validates ages, expected size and current weight", () => {
  for (const ageMonths of [2,4,6,8,10,18,24]) {
    assert.ok(Number.isFinite(estimatePercentage({weightKg:3,type:"puppy",ageMonths,adultWeightKg:8})));
  }
  for (const adultWeightKg of [10,25,35]) {
    assert.ok(Number.isFinite(estimatePercentage({weightKg:3,type:"puppy",ageMonths:7,adultWeightKg})));
  }
  assert.throws(() => estimatePercentage({weightKg:20,type:"puppy",ageMonths:4,adultWeightKg:8}), RangeError);
  assert.doesNotThrow(() => estimatePercentage({weightKg:8.8,type:"puppy",ageMonths:4,adultWeightKg:8}));
});

test("daily grams preserves the current multiplication rule", () => {
  assert.equal(dailyGrams(8,4.5),360);
  assert.throws(() => dailyGrams(0,4.5),RangeError);
});

test("energy macros add to 100 percent and zero kcal is safe", () => {
  const energy = computeEnergy({protein:20,fat:10,carbs:30,fiber:5});
  assert.ok(Math.abs(energy.proteinPct+energy.fatPct+energy.carbPct-100)<1e-9);
  assert.equal(energy.kcal,20*3.5+10*8.5+25*3.5);
  const zero = computeEnergy({protein:0,fat:0,carbs:0,fiber:0});
  assert.equal(zero.kcal,0);
  assert.deepEqual([zero.proteinPct,zero.fatPct,zero.carbPct],[0,0,0]);
});

test("fiber greater than carbohydrates produces zero digestible carbohydrates", () => {
  const energy = computeEnergy({protein:0,fat:0,carbs:2,fiber:5});
  assert.equal(energy.digestibleCarbs,0);
  assert.equal(energy.kcal,0);
});

test("buildPlan with real ingredients allocates all group shares", () => {
  const plan = buildPlan({weightKg:8,pct:4.5,groups:ingredientGroups,selectedIds:allIds,meals:2});
  assert.equal(plan.targetGrams,360);
  assert.ok(Math.abs(plan.totals.grams-plan.targetGrams)<1e-9);
  assert.deepEqual(plan.missingGroups,[]);
  assert.ok(Math.abs(plan.perMealGrams-180)<1e-9);
});

test("buildPlan reports missing groups and distributes only selected shares", () => {
  const selected = new Set(ingredientGroups.filter(group=>group.key!=="organ").flatMap(group=>group.items.slice(0,1).map(item=>item.id)));
  const plan = buildPlan({weightKg:8,pct:4.5,groups:ingredientGroups,selectedIds:selected,meals:2});
  assert.deepEqual(plan.missingGroups,[ingredientGroups.find(group=>group.key==="organ").name]);
  assert.ok(Math.abs(plan.totals.grams-360*.95)<1e-9);
  assert.ok(plan.totals.grams<plan.targetGrams);
});

test("empty selection has no rows and identifies every missing group", () => {
  assert.deepEqual(distributeIngredients(100,ingredientGroups,new Set()),[]);
  assert.equal(missingGroups(ingredientGroups,new Set()).length,ingredientGroups.length);
  assert.equal(sumMacros([]).grams,0);
});

test("profile validation covers inclusive limits, invalid values and manual percentage", () => {
  const validAdult = {type:"adult",weightKg:8,meals:2,manualPct:null,neutered:"yes",activity:"moderate"};
  assert.equal(validateProfile(validAdult).ok,true);
  assert.equal(validateProfile({...validAdult,weightKg:LIMITS.weightKg.min}).ok,true);
  assert.equal(validateProfile({...validAdult,weightKg:LIMITS.weightKg.max}).ok,true);
  assert.equal(validateProfile({...validAdult,weightKg:0}).field,"weightKg");
  assert.equal(validateProfile({...validAdult,weightKg:NaN}).ok,false);
  assert.equal(validateProfile({...validAdult,meals:5}).field,"meals");
  assert.equal(validateProfile({...validAdult,manualPct:12.1}).field,"manualPct");
  assert.equal(validateProfile({...validAdult,manualPct:2}).ok,true);
  assert.equal(validateProfile({...validAdult,activity:"extreme"}).field,"activity");
});

test("puppy profile rejects current weight above expected adult weight tolerance", () => {
  const puppy = {type:"puppy",weightKg:20,meals:2,ageMonths:4,adultWeightKg:8,manualPct:null};
  assert.equal(validateProfile(puppy).ok,false);
  assert.equal(validateProfile({...puppy,weightKg:8.8}).ok,true);
  assert.equal(validateProfile({...puppy,ageMonths:25}).ok,false);
});

test("manual percentage warns when it differs by more than two points", () => {
  const close = resolvePercentage({weightKg:8,type:"adult",manualPct:6.5});
  assert.equal(close.warning,false);
  const far = resolvePercentage({weightKg:8,type:"adult",manualPct:8});
  assert.equal(far.warning,true);
});

test("ingredient dataset keeps numeric composition unchanged and adds provenance metadata", () => {
  const ids = ingredientGroups.flatMap(group => group.items.map(item => item.id));
  assert.equal(new Set(ids).size,ids.length);
  assert.ok(Math.abs(ingredientGroups.reduce((sum,group)=>sum+group.share,0)-1)<1e-9);
  for (const group of ingredientGroups) for (const item of group.items) {
    for (const key of ["p","g","c","f"]) assert.ok(Number.isFinite(item[key])&&item[key]>=0);
    assert.equal(typeof item.verified,"boolean");
    assert.ok(Object.hasOwn(item,"source"));
    if (item.source !== null) assert.equal(item.verified,true);
  }
});
