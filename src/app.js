import {
  buildPlan, estimatePercentage, resolvePercentage, validateProfile
} from "./calculations.js";
import { ingredientGroups } from "./ingredients.js";

const $ = selector => document.querySelector(selector);
const form = $("#form");
const phase = $("#phase");
const result = $("#result");
const groupBox = $("#ingredientGroups");
const puppyNotice = $("#puppyNotice");
const fieldIds = {
  weightKg: "weight", ageMonths: "age", adultWeightKg: "adultWeight",
  meals: "meals", manualPct: "manual", neutered: "neutered", activity: "activity"
};
const fmt = value => Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const fields = Object.fromEntries(Object.entries(fieldIds).map(([key, id]) => [key, () => $("#"+id)]));

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = String(text);
  if (className) node.className = className;
  return node;
}
function cell(row, tag, text, scope) {
  const node = element(tag, text);
  if (scope) node.scope = scope;
  row.append(node);
}
function showError(message, fieldId) {
  const error = element("p", message, "notice");
  error.setAttribute("role", "alert");
  result.replaceChildren(error);
  const target = fieldId ? $("#"+fieldId) : null;
  if (target && !target.disabled) target.focus();
}
function syncPhase() {
  const puppy = phase.value === "puppy";
  $("#puppyFields").hidden = !puppy;
  $("#adultFields").hidden = puppy;
  $("#puppyFields").querySelectorAll("input,select").forEach(control => { control.disabled = !puppy; control.required = puppy; });
  $("#adultFields").querySelectorAll("input,select").forEach(control => { control.disabled = puppy; control.required = !puppy; });
  fields.weightKg().required = true;
  fields.meals().required = true;
  puppyNotice.hidden = !puppy;
}
phase.addEventListener("change", syncPhase);
syncPhase();

ingredientGroups.forEach(group => {
  const fieldset = document.createElement("fieldset");
  const legend = element("legend", group.name);
  const box = element("div", undefined, "checks");
  fieldset.append(legend, box);
  group.items.forEach(item => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = group.key;
    input.value = item.id;
    input.dataset.ingredientId = item.id;
    input.setAttribute("aria-describedby", "ingredientHint");
    label.append(input, document.createTextNode(item.name));
    box.append(label);
  });
  if (group.key === "organ") {
    const note = element("p", "O grupo inclui fígado. A frequência e a quantidade dependem de uma receita completa e de avaliação veterinária; a fração interna do modelo não é recomendação de consumo.", "hint");
    fieldset.append(note);
  }
  groupBox.append(fieldset);
});

const allChecks = () => [...form.querySelectorAll('input[type="checkbox"]:checked')];
const firstCheck = () => form.querySelector('input[type="checkbox"]');
function readProfile() {
  const manualRaw = fields.manualPct().value.trim();
  return {
    type: phase.value,
    weightKg: fields.weightKg().valueAsNumber,
    ageMonths: fields.ageMonths().valueAsNumber,
    adultWeightKg: fields.adultWeightKg().valueAsNumber,
    meals: Number(fields.meals().value),
    manualPct: manualRaw === "" ? null : fields.manualPct().valueAsNumber,
    neutered: fields.neutered().value,
    activity: fields.activity().value
  };
}
function renderResult(plan, pctInfo, meals, puppy) {
  const root = document.createElement("div");
  const heading = element("h3", "Estimativa calculada");
  heading.tabIndex = -1;
  root.append(heading);

  const incomplete = plan.missingGroups.length > 0;
  const metrics = element("div", undefined, "metrics");
  const metricItems = [
    [fmt(plan.targetGrams)+" g", "Alvo do modelo"],
    [fmt(plan.totals.grams)+" g", "Somatório selecionado"],
    [fmt(plan.perMealGrams)+" g", "Por refeição simulada · "+meals+"x"]
  ];
  metricItems.forEach(([value, label]) => {
    const card = element("div", undefined, "metric");
    card.append(element("strong", value), element("span", label));
    metrics.append(card);
  });
  root.append(element("p", "Simulação educativa: os números abaixo descrevem apenas o comportamento de um modelo matemático não validado; não são uma recomendação de quantidade para oferecer ao cão.", "callout"));
  root.append(metrics);

  if (incomplete) {
    const missingShare = ingredientGroups.filter(group => plan.missingGroups.includes(group.name)).reduce((sum, group) => sum + group.share, 0) * 100;
    const notice = element("div", undefined, "notice");
    notice.append(element("strong", "Estimativa incompleta: faltam "+fmt(missingShare)+"% da porção-alvo"), document.createTextNode(" Grupos sem seleção: "+plan.missingGroups.join("; ")+". A simulação não representa a distribuição completa definida pelo próprio modelo."));
    root.append(notice);
  }
  if (pctInfo.warning) {
    root.append(element("p", "O percentual manual difere muito da estimativa; confirme com seu veterinário.", "notice"));
  }
  if (puppy) {
    root.append(element("p", "Filhotes exigem formulação individual por veterinário, especialmente durante o crescimento.", "notice"));
  }
  root.append(element("p", "Este cálculo não avalia todos os nutrientes nem formula suplementos. Não é possível concluir que uma preparação seja completa ou adequada a partir destes resultados.", "notice"));
  if (incomplete) {
    root.append(element("p", "Energia omitida: a seleção está incompleta e a estimativa calórica seria apenas parcial.", "small"));
  } else {
    const energy = plan.energy;
    const metric = element("div", undefined, "metric energy-metric");
    metric.append(element("strong", fmt(energy.kcal)+" kcal"), element("span", "Energia calculada pelo modelo (não validada)"));
    root.append(metric);
    const distribution = element("p");
    distribution.append(element("strong", "Distribuição calórica aproximada: "), document.createTextNode(
      "proteína "+fmt(energy.proteinPct)+"% · gordura "+fmt(energy.fatPct)+"% · carboidrato digerível "+fmt(energy.carbPct)+"%."
    ));
    root.append(distribution);
  }

  const wrap = element("div", undefined, "table-wrap");
  const table = document.createElement("table");
  const caption = element("caption", "Ingredientes selecionados e estimativa de macronutrientes");
  caption.className = "visually-hidden";
  const thead = document.createElement("thead");
  const header = document.createElement("tr");
  ["Ingrediente", "g no modelo", "g/ref. simulada", "Prot. g", "Gord. g", "Carb. g", "Fibra g"].forEach(label => cell(header, "th", label, "col"));
  thead.append(header);
  const tbody = document.createElement("tbody");
  plan.rows.forEach(row => {
    const tr = document.createElement("tr");
    [row.name, fmt(row.grams), fmt(row.grams/meals), fmt(row.protein), fmt(row.fat), fmt(row.carbs), fmt(row.fiber)]
      .forEach((value, index) => cell(tr, "td", value));
    tbody.append(tr);
  });
  const total = document.createElement("tr");
  cell(total, "th", "Total", "row");
  [plan.totals.grams, plan.totals.grams/meals, plan.totals.protein, plan.totals.fat, plan.totals.carbs, plan.totals.fiber]
    .forEach(value => cell(total, "td", fmt(value)));
  tbody.append(total);
  table.append(caption, thead, tbody);
  wrap.append(table);
  root.append(wrap);

  root.append(element("p", "Parâmetro aplicado pelo modelo: "+fmt(pctInfo.pct)+"% do peso informado. É uma regra heurística não validada clinicamente; não constitui meta nutricional. A composição varia conforme corte, preparo e origem dos dados.", "small"));
  root.append(element("p", "Valores de composição ilustrativos — fonte não verificada.", "small"));
  result.replaceChildren(root);
  heading.focus();
  heading.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const profile = readProfile();
  const validation = validateProfile(profile);
  if (!validation.ok) {
    showError(validation.message, fieldIds[validation.field] || validation.field);
    return;
  }
  const checked = allChecks();
  if (!checked.length) {
    showError("Selecione ao menos um ingrediente.", firstCheck()?.id);
    firstCheck()?.focus();
    return;
  }
  const selectedIds = new Set(checked.map(input => input.dataset.ingredientId));
  let pctInfo;
  try {
    pctInfo = resolvePercentage(profile);
    const plan = buildPlan({
      weightKg: profile.weightKg, pct: pctInfo.pct,
      groups: ingredientGroups, selectedIds, meals: profile.meals
    });
    renderResult(plan, pctInfo, profile.meals, profile.type === "puppy");
  } catch (error) {
    const message = error.message === "weightKg exceeds expected adult weight"
      ? "O peso atual do filhote não pode ser maior que o peso adulto esperado."
      : "Não foi possível calcular com os dados informados. Revise o perfil.";
    showError(message, "weight");
  }
});
