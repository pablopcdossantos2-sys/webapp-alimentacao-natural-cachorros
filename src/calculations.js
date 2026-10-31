/** Pure helpers for an educational estimate. No formula here is clinically validated. */
export const LIMITS = Object.freeze({
  weightKg: { min: 0.5, max: 120 },
  manualPct: { min: 2, max: 12 },
  meals: { min: 1, max: 4 },
  ageMonths: { min: 2, max: 24 },
  adultWeightKg: { min: 1, max: 120 }
});
const PUPPY_MAX_WEIGHT_TOLERANCE = 1.1; // Heurística de coerência; requer revisão veterinária.

export function estimatePercentage({weightKg,type="adult",ageMonths=4,adultWeightKg=15,neutered="yes",activity="moderate"}) {
  if (!Number.isFinite(weightKg) || weightKg <= 0) throw new RangeError("weightKg must be positive");
  let base;
  if (type === "adult") {
    if (!["yes","no"].includes(neutered)) throw new RangeError("neutered must be yes or no");
    if (!["low","moderate","high"].includes(activity)) throw new RangeError("activity must be low, moderate or high");
    // Interpolação entre os pontos médios das faixas antigas; heurística sem validação clínica.
    const anchors = [[1.75,8.5],[4,5.5],[7.5,5],[22.5,4.5],[77.5,3.5]];
    if (weightKg <= anchors[0][0]) base = anchors[0][1];
    else if (weightKg >= anchors.at(-1)[0]) base = anchors.at(-1)[1];
    else {
      const i = anchors.findIndex(([x]) => x >= weightKg);
      const [x0,y0] = anchors[i-1], [x1,y1] = anchors[i];
      base = y0 + (y1-y0) * (weightKg-x0)/(x1-x0);
    }
    base += neutered === "yes" ? -0.5 : 0.5;
    base += activity === "low" ? -0.5 : activity === "high" ? 1 : 0;
  } else if (type === "puppy") {
    if (!Number.isFinite(ageMonths) || ageMonths < LIMITS.ageMonths.min || ageMonths > LIMITS.ageMonths.max) throw new RangeError("ageMonths must be between 2 and 24");
    if (!Number.isFinite(adultWeightKg) || adultWeightKg < LIMITS.adultWeightKg.min || adultWeightKg > LIMITS.adultWeightKg.max) throw new RangeError("adultWeightKg is outside limits");
    if (weightKg > adultWeightKg * PUPPY_MAX_WEIGHT_TOLERANCE) throw new RangeError("weightKg exceeds expected adult weight");
    const size = adultWeightKg < 10 ? 0 : adultWeightKg < 25 ? 1 : adultWeightKg < 35 ? 2 : 3;
    const row = ageMonths < 4 ? [10,10,8,8] : ageMonths < 6 ? [8,8,7,7] : ageMonths < 8 ? [6.5,6.5,6.5,6] : ageMonths < 10 ? [5.5,5.5,5.5,5] : ageMonths < 18 ? [5,5,4.5,4.5] : [5,4.5,4.25,3.5];
    base = row[size];
  } else throw new RangeError("type must be adult or puppy");
  return Math.max(2, Math.round(base * 10) / 10);
}

export function dailyGrams(weightKg, pct) {
  if (!Number.isFinite(weightKg) || weightKg <= 0 || !Number.isFinite(pct) || pct <= 0) throw new RangeError("weightKg and pct must be positive");
  return weightKg * pct * 10;
}
export function computeEnergy(totals) {
  const digestibleCarbs = Math.max(0, totals.carbs - totals.fiber);
  const kcal = totals.protein * 3.5 + totals.fat * 8.5 + digestibleCarbs * 3.5;
  return { digestibleCarbs, kcal, proteinPct: kcal ? totals.protein * 3.5 / kcal * 100 : 0, fatPct: kcal ? totals.fat * 8.5 / kcal * 100 : 0, carbPct: kcal ? digestibleCarbs * 3.5 / kcal * 100 : 0 };
}
export function distributeIngredients(dailyGrams, groups, selectedIds) {
  if (!Number.isFinite(dailyGrams) || dailyGrams < 0) throw new RangeError("dailyGrams must be non-negative");
  return groups.flatMap(group => {
    const selected = group.items.filter(item => selectedIds.has(item.id));
    if (!selected.length) return [];
    return selected.map(item => {
      const grams = dailyGrams * group.share / selected.length;
      return { id:item.id, name:item.name, grams, protein:grams*item.p/100, fat:grams*item.g/100, carbs:grams*item.c/100, fiber:grams*item.f/100 };
    });
  });
}
export function sumMacros(rows) {
  return rows.reduce((sum,row) => {
    sum.grams+=row.grams; sum.protein+=row.protein; sum.fat+=row.fat; sum.carbs+=row.carbs; sum.fiber+=row.fiber;
    return sum;
  },{grams:0,protein:0,fat:0,carbs:0,fiber:0});
}
export function missingGroups(groups, selectedIds) {
  return groups.filter(group => !group.items.some(item => selectedIds.has(item.id))).map(group => group.name);
}
export function buildPlan({weightKg,pct,groups,selectedIds,meals}) {
  if (!Number.isInteger(meals) || meals < LIMITS.meals.min || meals > LIMITS.meals.max) throw new RangeError("meals is outside limits");
  const targetGrams = dailyGrams(weightKg,pct);
  const rows = distributeIngredients(targetGrams,groups,selectedIds);
  const totals = sumMacros(rows);
  const absent = missingGroups(groups,selectedIds);
  return {targetGrams,rows,totals,missingGroups:absent,energy:computeEnergy(totals),perMealGrams:totals.grams/meals};
}
export function validateProfile(input) {
  const checks = [
    ["weightKg",input.weightKg,LIMITS.weightKg,"Informe um peso entre 0,5 e 120 kg."],
    ["meals",input.meals,LIMITS.meals,"Selecione de 1 a 4 refeições por dia."],
  ];
  for (const [field,value,limit,message] of checks) {
    if (!Number.isFinite(value) || value < limit.min || value > limit.max || (field==="meals" && !Number.isInteger(value))) return {ok:false,field,message};
  }
  if (input.manualPct !== null && (!Number.isFinite(input.manualPct) || input.manualPct < LIMITS.manualPct.min || input.manualPct > LIMITS.manualPct.max)) return {ok:false,field:"manualPct",message:"O percentual manual deve estar entre 2% e 12%, ou deixe o campo vazio."};
  if (input.type==="puppy") {
    for (const [field,value,limit,message] of [
      ["ageMonths",input.ageMonths,LIMITS.ageMonths,"Informe idade entre 2 e 24 meses."],
      ["adultWeightKg",input.adultWeightKg,LIMITS.adultWeightKg,"Informe peso adulto esperado entre 1 e 120 kg."]
    ]) if (!Number.isFinite(value)||value<limit.min||value>limit.max) return {ok:false,field,message};
    if (input.weightKg > input.adultWeightKg * PUPPY_MAX_WEIGHT_TOLERANCE) return {ok:false,field:"weightKg",message:"O peso atual do filhote não pode ser maior que o peso adulto esperado (com tolerância heurística de 10%)."};
  }
  if (input.type==="adult" && (!["yes","no"].includes(input.neutered)||!["low","moderate","high"].includes(input.activity))) return {ok:false,field:"activity",message:"Revise castração e nível de atividade."};
  if (!["adult","puppy"].includes(input.type)) return {ok:false,field:"type",message:"Selecione uma fase válida."};
  return {ok:true};
}
export function resolvePercentage({manualPct,...profile}) {
  const estimated = estimatePercentage(profile);
  return {pct:manualPct===null?estimated:manualPct,estimated,manualWarning:manualPct!==null && Math.abs(manualPct-estimated)>2};
}
