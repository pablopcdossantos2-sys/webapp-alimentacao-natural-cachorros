/*
 * Módulo 01 — perfil e necessidades energéticas.
 * Cálculos de referência para cães adultos saudáveis; não são prescrição.
 */
export const ENERGY_PROFILE_LIMITS = Object.freeze({
  weightKg: Object.freeze({ min: 0.5, max: 120 }),
  ageYears: Object.freeze({ min: 0.1, max: 30 }),
  meals: Object.freeze({ min: 1, max: 6 })
});

export const MERCK_ADULT_FACTORS = Object.freeze({
  neutered: Object.freeze({ factor: 1.6, label: "adulto castrado" }),
  intact: Object.freeze({ factor: 1.8, label: "adulto inteiro" }),
  obesityProne: Object.freeze({ factor: 1.4, label: "propenso à obesidade" })
});

export const FEDIAF_ACTIVITY_RATES = Object.freeze({
  low: Object.freeze({ min: 95, max: 95, label: "pouca atividade, menos de 1 hora por dia" }),
  moderateLow: Object.freeze({ min: 110, max: 110, label: "atividade moderada, 1–3 horas por dia, baixo impacto" }),
  moderateHigh: Object.freeze({ min: 125, max: 125, label: "atividade moderada, 1–3 horas por dia, alto impacto" }),
  high: Object.freeze({ min: 150, max: 175, label: "muita atividade, 3–6 horas por dia" })
});

const LIFE_STAGES = ["adult", "puppy", "senior", "gestation", "lactation", "clinical"];
const MUSCLE_CONDITIONS = ["notAssessed", "normal", "mildLoss", "moderateLoss", "severeLoss"];

function inRange(value, range) {
  return Number.isFinite(value) && value >= range.min && value <= range.max;
}

export function validateEnergyProfile(profile) {
  if (!profile || typeof profile !== "object") {
    return { ok: false, field: "weightKg", message: "Informe os dados do perfil." };
  }
  if (!inRange(profile.weightKg, ENERGY_PROFILE_LIMITS.weightKg)) {
    return { ok: false, field: "weightKg", message: "Informe um peso atual entre 0,5 e 120 kg." };
  }
  if (!LIFE_STAGES.includes(profile.lifeStage)) {
    return { ok: false, field: "lifeStage", message: "Selecione uma fase ou situação válida." };
  }
  if (profile.ageYears !== null && profile.ageYears !== undefined &&
      profile.ageYears !== "" && !inRange(profile.ageYears, ENERGY_PROFILE_LIMITS.ageYears)) {
    return { ok: false, field: "ageYears", message: "A idade deve estar entre 0,1 e 30 anos, ou deixe o campo vazio." };
  }
  if (!inRange(profile.meals, ENERGY_PROFILE_LIMITS.meals) || !Number.isInteger(profile.meals)) {
    return { ok: false, field: "meals", message: "Selecione de 1 a 6 refeições por dia." };
  }
  if (profile.bodyConditionScore !== null && profile.bodyConditionScore !== undefined &&
      profile.bodyConditionScore !== "" &&
      (!Number.isInteger(profile.bodyConditionScore) || profile.bodyConditionScore < 1 || profile.bodyConditionScore > 9)) {
    return { ok: false, field: "bcsScore", message: "O escore corporal deve ser um número inteiro de 1 a 9, ou não avaliado." };
  }
  if (!MUSCLE_CONDITIONS.includes(profile.muscleCondition)) {
    return { ok: false, field: "mcs", message: "Selecione uma condição muscular válida." };
  }
  if (typeof profile.breed !== "string" || profile.breed.length > 80) {
    return { ok: false, field: "breed", message: "O campo raça deve ter até 80 caracteres." };
  }
  if (profile.lifeStage === "adult") {
    if (!Object.hasOwn(MERCK_ADULT_FACTORS, profile.merckProfile)) {
      return { ok: false, field: "merckProfile", message: "Selecione um perfil Merck válido." };
    }
    if (!Object.hasOwn(FEDIAF_ACTIVITY_RATES, profile.activity)) {
      return { ok: false, field: "activity", message: "Selecione uma faixa de atividade válida." };
    }
  }
  return { ok: true };
}

/**
 * Calculates RER for all profiles. Adult MER estimates are only returned for
 * healthy adult dogs; growth, senior, reproduction and clinical cases require
 * their own validated model and veterinary assessment.
 */
export function calculateEnergyNeeds(profile) {
  const validation = validateEnergyProfile(profile);
  if (!validation.ok) throw new RangeError(validation.message);

  const metabolicWeight = profile.weightKg ** 0.75;
  const rerKcalDay = 70 * metabolicWeight;

  if (profile.lifeStage !== "adult") {
    return {
      status: "individualAssessmentRequired",
      metabolicWeight,
      rerKcalDay,
      lifeStage: profile.lifeStage
    };
  }

  const merckProfile = MERCK_ADULT_FACTORS[profile.merckProfile];
  const activityProfile = FEDIAF_ACTIVITY_RATES[profile.activity];
  const merckKcalDay = rerKcalDay * merckProfile.factor;
  const fediafMinKcalDay = activityProfile.min * metabolicWeight;
  const fediafMaxKcalDay = activityProfile.max * metabolicWeight;

  return {
    status: "adult",
    metabolicWeight,
    rerKcalDay,
    merck: {
      factor: merckProfile.factor,
      label: merckProfile.label,
      kcalDay: merckKcalDay,
      kcalPerMeal: merckKcalDay / profile.meals
    },
    fediaf: {
      minRate: activityProfile.min,
      maxRate: activityProfile.max,
      label: activityProfile.label,
      minKcalDay: fediafMinKcalDay,
      maxKcalDay: fediafMaxKcalDay,
      minKcalPerMeal: fediafMinKcalDay / profile.meals,
      maxKcalPerMeal: fediafMaxKcalDay / profile.meals
    }
  };
}
