import test from "node:test";
import assert from "node:assert/strict";
import {estimatePercentage,dailyGrams,computeEnergy,distributeIngredients,sumMacros,missingGroups,buildPlan,validateProfile,resolvePercentage,LIMITS} from "../src/calculations.js";
import {ingredientGroups} from "../src/ingredients.js";

test("adult and puppy baseline estimates remain recognizable",()=>{
  assert.equal(estimatePercentage({weightKg:8}),4.5);
  assert.equal(estimatePercentage({weightKg:2,neutered:"yes",activity:"low"}),7.5);
  assert.equal(estimatePercentage({weightKg:50,neutered:"yes",activity:"low"}),2.5);
  assert.equal(estimatePercentage({weightKg:3,type:"puppy",ageMonths:3,adultWeightKg:8}),10);
  assert.equal(estimatePercentage({weightKg:3,type:"puppy",ageMonths:7,adultWeightKg:30}),6.5);
});
test("daily grams and energy calculations handle edge cases",()=>{
  assert.equal(dailyGrams(8,4.5),360);
  const e=computeEnergy({protein:10,fat:5,carbs:8,fiber:2});
  assert.ok(Math.abs(e.proteinPct+e.fatPct+e.carbPct-100)<1e-9);
  assert.equal(computeEnergy({protein:0,fat:0,carbs:0,fiber:0}).kcal,0);
  assert.equal(computeEnergy({protein:0,fat:0,carbs:2,fiber:4}).digestibleCarbs,0);
});
test("distribution and macro sums use shared helpers",()=>{
  const rows=distributeIngredients(100,[{share:.4,items:[{id:"a",name:"A",p:10,g:2,c:3,f:1},{id:"b",name:"B",p:20,g:4,c:6,f:2}]}],new Set(["a","b"]));
  assert.equal(rows.length,2);assert.equal(rows[0].grams,20);assert.equal(sumMacros(rows).grams,40);assert.equal(sumMacros(rows).protein,6);
});
test("buildPlan preserves target and exposes missing group share",()=>{
  const all=new Set(ingredientGroups.flatMap(g=>g.items.map(i=>i.id)));
  const full=buildPlan({weightKg:8,pct:4.5,groups:ingredientGroups,selectedIds:all,meals:2});
  assert.equal(full.targetGrams,360);assert.ok(Math.abs(full.totals.grams-360)<1e-8);assert.deepEqual(full.missingGroups,[]);
  const partial=buildPlan({weightKg:8,pct:4.5,groups:ingredientGroups,selectedIds:new Set(["chicken"]),meals:2});
  assert.equal(partial.totals.grams,126);assert.deepEqual(partial.missingGroups,["Vísceras · 5%","Carboidratos · 35%","Vegetais · 25%"]);
});
test("profile validation rejects limits, puppy mismatch and invalid enums",()=>{
  const base={type:"adult",weightKg:8,meals:2,manualPct:null,neutered:"yes",activity:"moderate"};
  assert.equal(validateProfile(base).ok,true);
  for(const value of [NaN,.49,120.1]) assert.equal(validateProfile({...base,weightKg:value}).ok,false);
  assert.equal(validateProfile({...base,meals:5}).ok,false);
  assert.equal(validateProfile({...base,manualPct:12.1}).ok,false);
  assert.equal(validateProfile({...base,neutered:"banana"}).ok,false);
  assert.equal(validateProfile({...base,activity:"extreme"}).ok,false);
  assert.equal(validateProfile({...base,type:"puppy",weightKg:20,ageMonths:4,adultWeightKg:8}).ok,false);
  assert.equal(validateProfile({...base,type:"puppy",weightKg:8.8,ageMonths:4,adultWeightKg:8}).ok,true);
});
test("adult interpolation is continuous and non-increasing",()=>{
  let previous=estimatePercentage({weightKg:1});
  for(let w=1.1;w<=100;w+=.1){const current=estimatePercentage({weightKg:Number(w.toFixed(1))});assert.ok(Math.abs(current-previous)<=.3+1e-9);assert.ok(current<=previous+1e-9);previous=current;}
});
test("manual percentage warns when it differs by more than two points",()=>{
  assert.equal(resolvePercentage({weightKg:8,type:"adult",manualPct:8,neutered:"yes",activity:"moderate"}).manualWarning,true);
  assert.equal(resolvePercentage({weightKg:8,type:"adult",manualPct:5,neutered:"yes",activity:"moderate"}).manualWarning,false);
});
test("ingredient IDs, values and provenance metadata are consistent",()=>{
  const ids=ingredientGroups.flatMap(g=>g.items.map(i=>i.id));assert.equal(new Set(ids).size,ids.length);
  assert.ok(Math.abs(ingredientGroups.reduce((s,g)=>s+g.share,0)-1)<1e-9);
  for(const group of ingredientGroups)for(const item of group.items){
    for(const key of ["p","g","c","f"])assert.ok(Number.isFinite(item[key])&&item[key]>=0);
    assert.equal(typeof item.verified,"boolean");assert.ok(Object.hasOwn(item,"source"));
    if(item.source!==null)assert.equal(item.verified,true);
  }
});
test("documented profile limits are explicit",()=>{assert.equal(LIMITS.weightKg.min,.5);assert.equal(LIMITS.weightKg.max,120);});
