import test from "node:test";
import assert from "node:assert/strict";
import { estimatePercentage, distributeIngredients, sumMacros } from "../src/calculations.js";

test("adult estimate respects the implemented range and adjustment floor", () => {
  assert.equal(estimatePercentage({weightKg:8}), 4.5);
  assert.equal(estimatePercentage({weightKg:2,neutered:"yes",activity:"low"}), 7.5);
  assert.equal(estimatePercentage({weightKg:50,neutered:"yes",activity:"low"}), 2.5);
});

test("puppy percentage uses expected adult size and age band", () => {
  assert.equal(estimatePercentage({weightKg:3,type:"puppy",ageMonths:3,adultWeightKg:8}), 10);
  assert.equal(estimatePercentage({weightKg:3,type:"puppy",ageMonths:7,adultWeightKg:30}), 6.5);
});

test("invalid weight and puppy age are rejected", () => {
  assert.throws(() => estimatePercentage({weightKg:0}), RangeError);
  assert.throws(() => estimatePercentage({weightKg:2,type:"puppy",ageMonths:1,adultWeightKg:8}), RangeError);
});

test("category share is split equally across chosen ingredients", () => {
  const groups = [{share:.4,items:[{id:"a",name:"A",p:10,g:2,c:3,f:1},{id:"b",name:"B",p:20,g:4,c:6,f:2}]}];
  const rows = distributeIngredients(100,groups,new Set(["a","b"]));
  assert.equal(rows.length,2);
  assert.equal(rows[0].grams,20);
  assert.equal(rows[1].grams,20);
  assert.equal(sumMacros(rows).grams,40);
  assert.equal(sumMacros(rows).protein,6);
});

test("no selected items produces no allocated ingredient rows", () => {
  assert.deepEqual(distributeIngredients(100,[{share:.3,items:[{id:"x",name:"X",p:1,g:1,c:1,f:1}]}],new Set()),[]);
});
