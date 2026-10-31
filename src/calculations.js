/**
 * Regras aritméticas da calculadora educativa.
 * Parâmetros e resultados são heurísticos, não validados clinicamente.
 */

export const LIMITS = Object.freeze({
  weightKg: Object.freeze({ min: 0.5, max: 120 }),
  adultWeightKg: Object.freeze({ min: 1, max: 120 }),
  ageMonths: Object.freeze({ min: 2, max: 24 }),
  meals: Object.freeze({ min: 1, max: 4 }),
  manualPct: Object.freeze({ min: 2, max: 12 })
});

const ADULT_ANCHORS = Object.freeze([
  { weightKg: 1.75, pct: 8.5 },
  { weightKg: 4, pct: 5.5 },
  { weightKg: 7.5, pct: 5 },
  { weightKg: 22.5, pct: 4.5 },
  { weightKg: 77.5, pct: 3.5 }
]);
const PUPPY_ADULT_WEIGHT_TOLERANCE = 1.1;

function isInRange(value, range) {
  return Number.isFinite(value) && value >= range.min && value <= range.max;
}

function interpolateAdultPercentage(weightKg) {
  if (weightKg <= ADULT_ANCHORS[0].weightKg) return ADULT_ANCHORS[0].pct;
  for (let i = 1; i < ADULT_ANCHORS.length; i += 1) {
    const right = ADULT_ANCHORS[i];
    const left = ADULT_ANCHORS[i - 1];
    if (weightKg <= right.weightKg) {
      const ratio = (weightKg - left.weightKg) / (right.weightKg - left.weightKg);
      return left.pct + ratio * (right.pct - left.pct);
    }
  }
  const left = ADULT_ANCHORS.at(-1);
  const right = { weightKg: 100, pct: 3 };
  const ratio = Math.min(1, (weightKg - left.weightKg) / (right.weightKg - left.weightKg));
  return left.pct + ratio * (right.pct - left.pct);
}

/** Heurística contínua; não representa recomendação clínica. */
export function estimatePercentage({
  weightKg, type = "adult", ageMonths = 4, adultWeightKg = 15,
  neutered = "yes", activity = "moderate"
}) {
  if (!isInRange(weightKg, LIMITS.weightKg)) {
    throw new RangeError("weightKg must be between 0.5 and 120");
  }
  if (type !== "adult" && type !== "puppy") throw new RangeError("type must be adult or puppy");
  let base;
  if (type === "adult") {
    if (!["yes", "no"].includes(neutered)) throw new RangeError("neutered must be yes or no");
    if (!["low", "moderate", "high"].includes(activity)) throw new RangeError("activity must be low, moderate or high");
    base = interpolateAdultPercentage(weightKg);
    base += neutered === "yes" ? -0.5 : 0.5;
    base += activity === "low" ? -0.5 : activity === "high" ? 1 : 0;
  } else {
    if (!isInRange(ageMonths, LIMITS.ageMonths)) throw new RangeError("ageMonths must be between 2 and 24");
    if (!isInRange(adultWeightKg, LIMITS.adultWeightKg)) throw new RangeError("adultWeightKg must be between 1 and 120");
    if (weightKg > adultWeightKg * PUPPY_ADULT_WEIGHT_TOLERANCE) {
      throw new RangeError("weightKg exceeds expected adult weight");
    }
    const size = adultWeightKg < 10 ? 0 : adultWeightKg < 25 ? 1 : adultWeightKg < 35 ? 2 : 3;
    const row = ageMonths < 4 ? [10,10,8,8] : ageMonths < 6 ? [8,8,7,7] : ageMonths < 8 ? [6.5,6.5,6.5,6] : ageMonths < 10 ? [5.5,5.5,5.5,5] : ageMonths < 18 ? [5,5,4.5,4.5] : [5,4.5,4.25,3.5];
    base = row[size];
  }
  return Math.max(2, Math.round(base * 10) / 10);
}

export function dailyGrams(weightKg, pct) {
  if (!Number.isFinite(weightKg) || weightKg <= 0 || !Number.isFinite(pct) || pct <= 0) {
    throw new RangeError("weightKg and pct must be positive finite numbers");
  }
  return weightKg * pct * 10;
}

export function validateProfile(input) {
  const checks = [
    ["weightKg", input.weightKg, LIMITS.weightKg, "Informe um peso entre 0,5 e 120 kg."],
    ["meals", input.meals, LIMITS.meals, "Selecione de 1 a 4 refeições por dia."]
  ];
  if (input.type === "puppy") {
    checks.push(["ageMonths", input.ageMonths, LIMITS.ageMonths, "Informe uma idade entre 2 e 24 meses."]);
    checks.push(["adultWeightKg", input.adultWeightKg, LIMITS.adultWeightKg, "Informe um peso adulto esperado entre 1 e 120 kg."]);
  } else if (input.type !== "adult") {
    return { ok: false, field: "phase", message: "Selecione uma fase válida." };
  } else {
    if (!["yes", "no"].includes(input.neutered)) return { ok: false, field: "neutered", message: "Selecione uma opção de castração válida." };
    if (!["low", "moderate", "high"].includes(input.activity)) return { ok: false, field: "activity", message: "Selecione um nível de atividade válido." };
  }
  for (const [field, value, range, message] of checks) {
    if (!isInRange(value, range) || (field === "meals" && !Number.isInteger(value))) return { ok: false, field, message };
  }
  if (input.manualPct !== null && input.manualPct !== undefined && !isInRange(input.manualPct, LIMITS.manualPct)) {
    return { ok: false, field: "manualPct", message: "O percentual manual deve estar entre 2% e 12%, ou deixe o campo vazio." };
  }
  if (input.type === "puppy" && input.weightKg > input.adultWeightKg * PUPPY_ADULT_WEIGHT_TOLERANCE) {
    return { ok: false, field: "weightKg", message: "O peso atual do filhote não pode ser maior que o peso adulto esperado (considerando tolerância de 10%)." };
  }
  return { ok: true };
}

export function resolvePercentage({ manualPct, ...profile }) {
  const estimatedPct = estimatePercentage(profile);
  if (manualPct === null || manualPct === undefined) {
    return { pct: estimatedPct, estimatedPct, manual: false, warning: false };
  }
  if (!isInRange(manualPct, LIMITS.manualPct)) throw new RangeError("manualPct must be between 2 and 12");
  return {
    pct: manualPct, estimatedPct, manual: true,
    warning: Math.abs(manualPct - estimatedPct) > 2
  };
}

export function missingGroups(groups, selectedIds) {
  return groups.filter(group => !group.items.some(item => selectedIds.has(item.id))).map(group => group.name);
}

/** Split each group's target share equally among selected ingredients. */
export function distributeIngredients(dailyTargetGrams, groups, selectedIds) {
  if (!Number.isFinite(dailyTargetGrams) || dailyTargetGrams < 0) throw new RangeError("dailyTargetGrams must be non-negative");
  return groups.flatMap(group => {
    const selected = group.items.filter(item => selectedIds.has(item.id));
    if (!selected.length) return [];
    return selected.map(item => {
      const grams = dailyTargetGrams * group.share / selected.length;
      return {
        id: item.id, name: item.name, grams,
        protein: grams * item.p / 100,
        fat: grams * item.g / 100,
        carbs: grams * item.c / 100,
        fiber: grams * item.f / 100
      };
    });
  });
}

export function sumMacros(rows) {
  return rows.reduce((sum, row) => {
    sum.grams += row.grams; sum.protein += row.protein; sum.fat += row.fat;
    sum.carbs += row.carbs; sum.fiber += row.fiber;
    return sum;
  }, { grams: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 });
}

export function computeEnergy(totals) {
  const digestibleCarbs = Math.max(0, totals.carbs - totals.fiber);
  const kcal = totals.protein * 3.5 + totals.fat * 8.5 + digestibleCarbs * 3.5;
  return {
    digestibleCarbs, kcal,
    proteinPct: kcal ? totals.protein * 3.5 / kcal * 100 : 0,
    fatPct: kcal ? totals.fat * 8.5 / kcal * 100 : 0,
    carbPct: kcal ? digestibleCarbs * 3.5 / kcal * 100 : 0
  };
}

export function buildPlan({ weightKg, pct, groups, selectedIds, meals }) {
  if (!Number.isInteger(meals) || !isInRange(meals, LIMITS.meals)) throw new RangeError("meals must be an integer from 1 to 4");
  const targetGrams = dailyGrams(weightKg, pct);
  const missing = missingGroups(groups, selectedIds);
  const rows = distributeIngredients(targetGrams, groups, selectedIds);
  const totals = sumMacros(rows);
  const energy = computeEnergy(totals);
  return {
    targetGrams, rows, totals, missingGroups: missing, energy,
    perMealGrams: totals.grams / meals
  };
}
