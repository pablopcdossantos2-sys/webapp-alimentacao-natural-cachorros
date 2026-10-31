import { buildPlan, resolvePercentage, validateProfile } from "./calculations.js";
import { ingredientGroups as groups } from "./ingredients.js";

const $ = selector => document.querySelector(selector);
const form=$("#form"), phase=$("#phase"), result=$("#result");
const fields={puppy:$("#puppyFields"),adult:$("#adultFields")};
const fmt=n=>Number(n).toLocaleString("pt-BR",{maximumFractionDigits:1});
const el=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);if(className)n.className=className;return n;};
function setPhase(){
  const puppy=phase.value==="puppy";
  for(const [key,box] of Object.entries(fields)){
    box.hidden=(key==="puppy")!==puppy;
    box.querySelectorAll("input,select").forEach(control=>{control.disabled=box.hidden;});
  }
  $("#puppyModeNotice").hidden=!puppy;
}
phase.addEventListener("change",setPhase);setPhase();

const ingredientMap=new Map();
groups.forEach(group=>{
  const fs=el("fieldset"),legend=el("legend",group.name),box=el("div",undefined,"checks");
  fs.append(legend,box);
  group.items.forEach(item=>{
    const label=el("label"),input=el("input");
    input.type="checkbox";input.name=group.key;input.value=item.id;
    ingredientMap.set(item.id,input);
    label.append(input,document.createTextNode(item.name));box.append(label);
  });
  if(group.key==="organ")fs.append(el("p","A frequência e o limite diário de fígado exigem revisão veterinária.","hint"));
  $("#ingredientGroups").append(fs);
});
function showError(message,control){
  const alert=el("p",message,"notice");alert.setAttribute("role","alert");alert.tabIndex=-1;
  result.replaceChildren(alert);alert.focus();
  if(control)control.focus();
}
function metric(value,label){const card=el("div",undefined,"metric");card.append(el("strong",value),el("span",label));return card;}
function render(plan,pct,meals,manualWarning,isPuppy){
  const root=el("div"),heading=el("h3","Estimativa calculada");heading.tabIndex=-1;root.append(heading);
  if(isPuppy){const n=el("div","Filhotes exigem formulação individual por veterinário.","notice");n.setAttribute("role","note");root.append(n);}
  const incomplete=plan.missingGroups.length>0;
  const metrics=el("div",undefined,"metrics");
  metrics.append(metric(fmt(plan.targetGrams)+" g","Alvo diário"),metric(fmt(plan.totals.grams)+" g","Distribuído"),metric(fmt(plan.perMealGrams)+" g","Distribuído por refeição · "+meals+"x"));
  metrics.append(metric(fmt(plan.energy.kcal)+" kcal",incomplete?"kcal parcial (grupos faltando)":"energia estimada/dia"));
  root.append(metrics);
  if(incomplete){
    const missingShare=groups.filter(g=>plan.missingGroups.includes(g.name)).reduce((s,g)=>s+g.share,0);
    const notice=el("div",undefined,"notice");notice.append(el("strong","Estimativa incompleta: faltam "+fmt(missingShare*100)+"% da porção-alvo."),document.createTextNode(" Grupos sem seleção: "+plan.missingGroups.join("; ")+". O total distribuído não corresponde ao alvo diário."));root.append(notice);
  }
  if(manualWarning)root.append(el("p","O percentual manual difere muito da estimativa; confirme com seu veterinário.","notice"));
  const table=el("table"),caption=el("caption","Distribuição estimada dos ingredientes");caption.className="visually-hidden";
  const thead=el("thead"),head=el("tr");["Ingrediente","g/dia","g/ref.","Prot. g","Gord. g","Carb. g","Fibra g"].forEach(t=>{const th=el("th",t);th.scope="col";head.append(th);});thead.append(head);
  const tbody=el("tbody");
  plan.rows.forEach(r=>{const tr=el("tr");[r.name,fmt(r.grams),fmt(r.grams/meals),fmt(r.protein),fmt(r.fat),fmt(r.carbs),fmt(r.fiber)].forEach(t=>tr.append(el("td",t)));tbody.append(tr);});
  const total=el("tr"),rowHead=el("th","Total");rowHead.scope="row";total.append(rowHead);
  [fmt(plan.totals.grams),fmt(plan.perMealGrams),fmt(plan.totals.protein),fmt(plan.totals.fat),fmt(plan.totals.carbs),fmt(plan.totals.fiber)].forEach(t=>total.append(el("td",t)));tbody.append(total);
  table.append(caption,thead,tbody);const wrap=el("div",undefined,"table-wrap");wrap.append(table);root.append(wrap);
  root.append(el("p","Distribuição calórica aproximada: proteína "+fmt(plan.energy.proteinPct)+"% · gordura "+fmt(plan.energy.fatPct)+"% · carboidrato digerível "+fmt(plan.energy.carbPct)+"%."));
  root.append(el("p","Percentual aplicado: "+fmt(pct)+"% do peso informado. Fatores energéticos e composição são aproximados.","small"));
  root.append(el("div","Resultado parcial e educativo: sem suplementação vitamínico-mineral orientada por veterinário esta combinação não é dieta completa (ex.: cálcio).","notice"));
  root.append(el("p","Valores de composição ilustrativos — fonte não verificada.","small"));
  result.replaceChildren(root);
  heading.focus();
  heading.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
}
form.addEventListener("submit",event=>{
  event.preventDefault();
  const input={
    type:phase.value,weightKg:$("#weight").valueAsNumber,ageMonths:$("#age").valueAsNumber,
    adultWeightKg:$("#adultWeight").valueAsNumber,neutered:$("#neutered").value,
    activity:$("#activity").value,meals:Number($("#meals").value),
    manualPct:$("#manual").value.trim()===""?null:$("#manual").valueAsNumber
  };
  const validation=validateProfile(input);
  if(!validation.ok){const control=$("#"+({manualPct:"manual",weightKg:"weight",ageMonths:"age",adultWeightKg:"adultWeight",meals:"meals",activity:"activity"}[validation.field]||validation.field));showError(validation.message,control);return;}
  const selectedIds=new Set([...ingredientMap].filter(([,control])=>control.checked).map(([id])=>id));
  if(selectedIds.size===0){showError("Selecione ao menos um ingrediente.",ingredientMap.values().next().value);return;}
  try{
    const resolved=resolvePercentage({...input});
    const plan=buildPlan({weightKg:input.weightKg,pct:resolved.pct,groups,selectedIds,meals:input.meals});
    render(plan,resolved.pct,input.meals,resolved.manualWarning,input.type==="puppy");
  }catch(error){showError(error.message||"Não foi possível calcular com os dados informados.");}
});
