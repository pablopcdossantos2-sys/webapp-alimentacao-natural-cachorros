import {
  calculateEnergyNeeds, validateEnergyProfile
} from "./energy.js";

const $ = selector => document.querySelector(selector);
const form = $("#energyForm");
const result = $("#result");
const stage = $("#lifeStage");
const adultFields = $("#adultEnergyFields");

const stageLabels = {
  adult: "Adulto saudável",
  puppy: "Filhote / crescimento",
  senior: "Idoso",
  gestation: "Gestação",
  lactation: "Lactação",
  clinical: "Doença ou dieta terapêutica"
};
const mcsLabels = {
  notAssessed: "não avaliada",
  normal: "adequada",
  mildLoss: "perda leve",
  moderateLoss: "perda moderada",
  severeLoss: "perda grave"
};
const fmt = value => Number(value).toLocaleString("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1
});
const fmtKcal = value => Math.round(value).toLocaleString("pt-BR");

function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined && text !== null) node.textContent = String(text);
  if (className) node.className = className;
  return node;
}
function metric(parent, value, label, accent) {
  const card = el("div", undefined, "metric");
  if (accent) card.style.setProperty("--metric-accent", "var(--" + accent + ")");
  card.append(el("strong", value), el("span", label));
  parent.append(card);
}
function readProfile() {
  const ageText = $("#ageYears").value.trim();
  const bcsText = $("#bcsScore").value;
  return {
    lifeStage: stage.value,
    weightKg: $("#weightKg").valueAsNumber,
    ageYears: ageText === "" ? null : Number(ageText),
    breed: $("#breed").value.trim(),
    merckProfile: $("#merckProfile").value,
    activity: $("#activity").value,
    bodyConditionScore: bcsText === "" ? null : Number(bcsText),
    muscleCondition: $("#mcs").value,
    meals: Number($("#meals").value)
  };
}
function syncStage() {
  const adult = stage.value === "adult";
  adultFields.hidden = !adult;
  adultFields.querySelectorAll("select").forEach(control => {
    control.disabled = !adult;
  });
}
stage.addEventListener("change", syncStage);
syncStage();

function showError(message, fieldId) {
  const notice = el("p", message, "notice");
  notice.setAttribute("role", "alert");
  result.replaceChildren(notice);
  if (fieldId) $("#" + fieldId).focus();
}
function addNotice(parent, heading, body, className = "notice") {
  const box = el("div", undefined, className);
  box.append(el("strong", heading), document.createTextNode(body));
  parent.append(box);
}
function renderResult(profile, needs) {
  const root = document.createElement("div");
  const heading = el("h3", "Referências calculadas");
  heading.tabIndex = -1;
  root.append(heading);
  const profileLine = el("p", undefined, "small");
  const breedText = profile.breed ? " · raça informada: " + profile.breed : "";
  profileLine.textContent = stageLabels[profile.lifeStage] + " · " +
    fmt(profile.weightKg) + " kg" + breedText;
  root.append(profileLine);

  const metrics = el("div", undefined, "metrics energy-metrics");
  metric(metrics, fmtKcal(needs.rerKcalDay) + " kcal", "RER · energia de repouso por dia", "coral");
  if (needs.status === "adult") {
    metric(metrics, fmtKcal(needs.merck.kcalDay) + " kcal", "Merck · MER estimada por dia", "blue");
    const fediafValue = needs.fediaf.minKcalDay === needs.fediaf.maxKcalDay
      ? fmtKcal(needs.fediaf.minKcalDay) + " kcal"
      : fmtKcal(needs.fediaf.minKcalDay) + "–" + fmtKcal(needs.fediaf.maxKcalDay) + " kcal";
    metric(metrics, fediafValue, "FEDIAF 2025 · referência por atividade/dia", "violet");
  }
  root.append(metrics);

  if (needs.status === "adult") {
    const details = el("div", undefined, "energy-detail");
    details.append(el("h3", "Como ler as duas estimativas"));
    const merckText = "Merck: fator " + fmt(needs.merck.factor) +
      " (" + needs.merck.label + ") × RER = " + fmtKcal(needs.merck.kcalDay) +
      " kcal/dia, aproximadamente " + fmtKcal(needs.merck.kcalPerMeal) +
      " kcal por refeição se forem " + profile.meals + " refeições.";
    const fediafRange = needs.fediaf.minKcalDay === needs.fediaf.maxKcalDay
      ? fmtKcal(needs.fediaf.minKcalDay) + " kcal/dia"
      : fmtKcal(needs.fediaf.minKcalDay) + "–" + fmtKcal(needs.fediaf.maxKcalDay) + " kcal/dia";
    const fediafText = "FEDIAF 2025: " + needs.fediaf.minRate +
      (needs.fediaf.maxRate !== needs.fediaf.minRate ? "–" + needs.fediaf.maxRate : "") +
      " kcal × kg⁰·⁷⁵ (" + needs.fediaf.label + ") = " + fediafRange +
      ", aproximadamente " + fmtKcal(needs.fediaf.minKcalPerMeal) +
      (needs.fediaf.maxKcalPerMeal !== needs.fediaf.minKcalPerMeal
        ? "–" + fmtKcal(needs.fediaf.maxKcalPerMeal) : "") +
      " kcal por refeição.";
    details.append(el("p", merckText), el("p", fediafText));
    details.append(el("p", "Os métodos são independentes. Não somamos nem calculamos uma média entre eles. Eles oferecem referências iniciais diferentes, que precisam ser confrontadas com a evolução real do peso e da condição corporal.", "hint"));
    root.append(details);

    const formula = document.createElement("details");
    formula.append(el("summary", "Ver fórmulas e premissas"));
    const list = document.createElement("ul");
    [
      "RER = 70 × peso atual em kg elevado a 0,75.",
      "Merck: RER × fator selecionado para o perfil adulto.",
      "FEDIAF: valor energético por kg elevado a 0,75 correspondente à faixa de atividade descrita na diretriz de 2025.",
      "As kcal por refeição são apenas a divisão aritmética da estimativa diária pelo número de refeições informado; não representam quantidade em gramas."
    ].forEach(item => list.append(el("li", item)));
    formula.append(list);
    root.append(formula);
  } else {
    addNotice(root, "RER exibido apenas como referência de repouso",
      "Para " + stageLabels[profile.lifeStage].toLowerCase() +
      " não aplicamos os fatores de manutenção de adultos nem a tabela de atividade adulta. O RER não deve ser usado como meta diária de alimentação. A estimativa específica desta fase ou condição será desenvolvida em módulo próprio e exige avaliação veterinária.");
  }

  if (profile.bodyConditionScore !== null && profile.bodyConditionScore !== 4 && profile.bodyConditionScore !== 5) {
    addNotice(root, "Condição corporal fora da faixa de referência",
      "O escore informado foi " + profile.bodyConditionScore +
      "/9. A faixa 4–5/9 costuma ser considerada ideal. Não corrigimos peso nem energia automaticamente: é necessária avaliação individual antes de definir uma meta alimentar.");
  }
  if (profile.muscleCondition !== "normal" && profile.muscleCondition !== "notAssessed") {
    addNotice(root, "Atenção à condição muscular",
      "Foi registrada " + mcsLabels[profile.muscleCondition] +
      ". A condição muscular deve ser avaliada junto da condição corporal e do histórico clínico; não ajustamos a energia automaticamente.");
  }
  if (profile.ageYears !== null && profile.ageYears >= 7 && profile.lifeStage === "adult") {
    addNotice(root, "Revise a classificação da fase de vida",
      "A idade informada é " + fmt(profile.ageYears) +
      " anos. Confirme com o veterinário se o perfil deve ser tratado como adulto ou idoso; não existe um corte universal aplicado automaticamente pelo sistema.", "callout");
  }
  root.append(el("p",
    "A raça e a idade são registradas para contextualizar o perfil, mas não alteram automaticamente os cálculos nesta versão. Não há um multiplicador universal por raça implementado.",
    "small"));
  root.append(el("p",
    "Uma estimativa energética não determina a composição da refeição. Ainda faltam os cálculos de todos os nutrientes essenciais, a seleção quantitativa de ingredientes, os suplementos específicos e a validação da receita.",
    "notice"));

  result.replaceChildren(root);
  heading.focus();
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const profile = readProfile();
  const validation = validateEnergyProfile(profile);
  if (!validation.ok) {
    showError(validation.message, validation.field);
    return;
  }
  try {
    const needs = calculateEnergyNeeds(profile);
    renderResult(profile, needs);
  } catch (error) {
    showError("Não foi possível calcular com os dados informados. Revise o peso e as opções selecionadas.", "weightKg");
  }
});
