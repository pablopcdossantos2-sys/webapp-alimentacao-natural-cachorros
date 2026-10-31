/** Pure arithmetic helpers for the educational calculator.
 * Nutritional assumptions are illustrative and must be reviewed by a veterinary nutritionist.
 */
export function estimatePercentage({weightKg,type="adult",ageMonths=4,adultWeightKg=15,neutered="yes",activity="moderate"}) {
  if (!Number.isFinite(weightKg) || weightKg <= 0) throw new RangeError("weightKg must be positive");
  let base;
  if (type === "adult") {
    const range = weightKg <= 3 ? [7,10] : weightKg <= 5 ? [5,6] : weightKg <= 10 ? [4,6] : weightKg <= 35 ? [4,5] : [3,4];
    base = (range[0] + range[1]) / 2;
  } else if (type === "puppy") {
    if (!Number.isFinite(ageMonths) || ageMonths < 2 || ageMonths > 24) throw new RangeError("ageMonths must be between 2 and 24");
    if (!Number.isFinite(adultWeightKg) || adultWeightKg <= 0) throw new RangeError("adultWeightKg must be positive");
    const size = adultWeightKg < 10 ? 0 : adultWeightKg < 25 ? 1 : adultWeightKg < 35 ? 2 : 3;
    const row = ageMonths < 4 ? [10,10,8,8] : ageMonths < 6 ? [8,8,7,7] : ageMonths < 8 ? [6.5,6.5,6.5,6] : ageMonths < 10 ? [5.5,5.5,5.5,5] : ageMonths < 18 ? [5,5,4.5,4.5] : [5,4.5,4.25,3.5];
    base = row[size];
  } else throw new RangeError("type must be adult or puppy");
  let adjustment = 0;
  if (type === "adult") {
    adjustment += neutered === "yes" ? -0.5 : 0.5;
    adjustment += activity === "low" ? -0.5 : activity === "high" ? 1 : 0;
  }
  return Math.max(2, Math.round((base + adjustment) * 10) / 10);
}

/** Split a target cooked-food weight evenly across selected items in each group. */
export function distributeIngredients(dailyGrams, groups, selectedIds) {
  if (!Number.isFinite(dailyGrams) || dailyGrams < 0) throw new RangeError("dailyGrams must be non-negative");
  return groups.flatMap(group => {
    const selected = group.items.filter(item => selectedIds.has(item.id));
    if (!selected.length) return [];
    return selected.map(item => {
      const grams = dailyGrams * group.share / selected.length;
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
  }, {grams:0,protein:0,fat:0,carbs:0,fiber:0});
}
