# Relatório de análise — Prato de Cão (calculadora AN cozida para cães)

**Público-alvo deste documento:** uma IA executora de código. Cada achado traz evidência, causa, correção prescrita e critério de aceite verificável.
**Repositório analisado:** `webapp-alimentacao-natural-cachorros` (branch `feat/mvp-calculadora-an-cozida`), 8 arquivos: `index.html`, `src/calculations.js`, `src/ingredients.js`, `tests/calculations.test.js`, `package.json`, `README.md`, `docs/fase-01-pendencias.md`, `.github/workflows/tests.yml`.
**Método:** leitura integral do código; `node --test` (6/6 passam, Node 22.23); execução do app em Chromium (Playwright) com servidor HTTP local; cálculos numéricos com os módulos reais; razões de contraste WCAG calculadas. O zip não contém `.git`, então commits citados em `docs/` não puderam ser verificados.

---

## 0. Regras para a IA executora (ler antes de agir)

1. **Não invente** fontes, códigos de tabela (TACO/USDA etc.), atribuições, licenças ou referências (NRC/FEDIAF/AAFCO/WSAVA). Isso é pendência humana explícita em `docs/fase-01-pendencias.md`.
2. **Não altere valores nutricionais** de `src/ingredients.js` nem as faixas percentuais "por julgamento clínico". Mudanças de heurística marcadas como *decisão humana* (F06, F12) só devem ser implementadas na forma descrita e rotuladas como não validadas.
3. **Não** publique, ative GitHub Pages, faça merge nem defina licença.
4. Manter: app estático, sem build e sem dependências de runtime, UI em pt-BR, tom educativo (nunca "prescrição"). Dependências de desenvolvimento só se indicado (F14).
5. Sem `innerHTML` com dados dinâmicos (o projeto já cumpre isso; manter).
6. Ao terminar cada item, rodar `npm test` e atualizar `docs/fase-01-pendencias.md` (checklist + "Histórico de pendências resolvidas", com data e evidência). Não marque como resolvido o que não foi verificado no navegador.
7. Sugestão de ordem: **F01 → F04 → F02 → F03 → F05 → F07 → F13 → F08 → F09 → F10 → F11 → F14 → F06 → F12**.

---

## 1. Resumo dos achados

| ID | Sev. | Tema | Resumo |
|----|------|------|--------|
| F01 | **Alta** | UI | Atributo `hidden` anulado por CSS: campos de filhote **e** adulto sempre visíveis (confirmado no navegador) |
| F02 | **Alta** | Arquitetura/testes | Lógica de cálculo duplicada no `index.html`; funções testadas não são usadas pelo app |
| F03 | **Alta** | Lógica/UX | Sem ingredientes selecionados → resultado "0 g / 0 kcal" sem bloqueio; texto de ajuda diz "ao menos um por grupo" mas não é imposto |
| F04 | Média | Formulário | Validação nativa conflita com a validação JS; campos ocultos inválidos bloqueiam o envio silenciosamente; `step` rejeita decimais |
| F05 | Média | Validação | Filhote mais pesado que o peso adulto esperado é aceito (ex.: 20 kg com adulto 8 kg) |
| F06 | Média | Heurística | Percentual em degraus: variações de até ~25–35 % na porção por 0,1–0,2 kg de diferença |
| F07 | Baixa | Módulo | Enums inválidos aceitos silenciosamente; `Math.max(2, …)` inalcançável; título de teste enganoso |
| F08 | **Alta** (a11y) | Contraste | Botão no tema escuro: branco sobre `#8fd2a5` = **1,76:1** |
| F09 | Média | Acessibilidade | Erros sem `role="alert"`, foco inconsistente, resultado fora da tela no mobile, tabela sem `scope`/legenda, sem `:focus-visible` explícito |
| F10 | Baixa | Robustez | Seletor CSS montado por concatenação de strings para achar checkboxes |
| F11 | Média | Docs | `README.md` e `docs/fase-01-pendencias.md` contêm sequências literais `\n` e ``\`\`\` `` (markdown quebrado) |
| F12 | **Alta** (segurança) | Conteúdo | Aviso de suplementação só no rodapé; modo filhote sem aviso específico; fígado a 5 % diário sem aviso; inconsistência "grelhado" |
| F13 | Média | Validação | Percentual manual validado só no HTML (duplicado, fora do módulo, sem checagem de sanidade) |
| F14 | Baixa | Infra | Sem `.gitignore`, sem `engines`, sem teste de navegador; docs afirmam cobertura de testes que não corresponde ao caminho real |

---

## 2. Achados detalhados

### F01 — `hidden` não esconde os campos (ALTA)

**Evidência (Chromium):** na carga inicial `#puppyFields` tem `hidden=true` mas `getComputedStyle().display === "grid"`. Em modo "Adulto" os campos de filhote aparecem; em modo "Filhote" os de adulto (castração/atividade) continuam visíveis (confirmado em screenshot 390 px).
**Causa:** `index.html` linha 17: `.fields{display:grid…}` tem especificidade/ordem superior à folha UA `[hidden]{display:none}`.
**Correção:** adicionar ao `<style>`, depois de `.fields`:
```css
[hidden]{display:none !important}
```
**Aceite:** no Chromium, `getComputedStyle(#puppyFields).display === "none"` quando Fase = Adulto e `#adultFields` = `none` quando Fase = Filhote; alternar fase mostra/oculta corretamente.

---

### F02 — Lógica duplicada; testes cobrem código morto (ALTA)

**Evidência:** `index.html` linhas 95–104 reimplementam distribuição por grupo e soma (`{g,p,fat,c,fiber}`), enquanto `src/calculations.js` exporta `distributeIngredients` e `sumMacros` (chaves `{grams,protein,fat,carbs,fiber}`) que **nenhum código do app importa** (só `estimatePercentage` é importado). Os testes 4–5 validam apenas as funções mortas. Cálculo de kcal, distribuição calórica, `digest = max(0, carb − fibra)` e `daily = w*pct*10` também só existem no HTML, sem testes. Divergência futura é praticamente garantida.
**Correção:**
1. Criar em `src/calculations.js`:
   - `dailyGrams(weightKg, pct)` → `weightKg * pct * 10`;
   - `computeEnergy(totals)` → `{ digestibleCarbs, kcal, proteinPct, fatPct, carbPct }` (fatores atuais: proteína 3,5; gordura 8,5; carbo digerível 3,5 kcal/g; `kcal===0` ⇒ percentuais 0);
   - `buildPlan({ weightKg, pct, groups, selectedIds, meals })` que devolve `{ targetGrams, rows, totals, missingGroups, energy, perMealGrams }` usando `distributeIngredients`/`sumMacros`. `distributeIngredients` deve também devolver/aceitar a informação de grupos ausentes (ex.: função irmã `missingGroups(groups, selectedIds)` que devolve `group.name`).
2. Mover o `<script type="module">` inline para `src/app.js` (`<script type="module" src="./src/app.js">`) e fazer o handler de submit só ler o DOM, chamar `buildPlan` e renderizar. Ajustar `renderResult` às chaves do módulo (`grams/protein/fat/carbs/fiber`).
3. Remover a função `percent()` pass-through do HTML.
4. Novos testes (`node:test`): `dailyGrams` (8 kg × 4,5 % = 360 g), `computeEnergy` (soma dos três percentuais ≈ 100; kcal 0 não gera NaN), `buildPlan` com o dataset real (todos selecionados ⇒ soma de `grams` = `targetGrams`; um grupo vazio ⇒ soma = alvo × (1 − share), `missingGroups` correto), `computeEnergy` com fibra > carbo (digerível = 0).
**Aceite:** `grep -n "innerHTML"` sem ocorrências; `index.html` sem lógica de cálculo; os valores exibidos para o cenário padrão (8 kg adulto, castrado, moderado, todos os ingredientes selecionados) são idênticos aos de antes da refatoração (**360 g/dia, 337,5 kcal**); `npm test` verde.

---

### F03 — Seleção vazia/parcial não é tratada (ALTA)

**Evidência:** sem nenhum ingrediente marcado o app exibe "0 g total calculado/dia · 0 kcal" mais um aviso listando os 4 grupos e uma tabela só com a linha "Total 0". O texto na UI diz *"Selecione ao menos um alimento em cada grupo"*, mas a regra não é aplicada. Com grupos parciais, "total calculado/dia" e "g por refeição" exibem apenas a parte distribuída, sem mostrar o alvo — o tutor pode alimentar o cão com menos do que o necessário.
**Correção (sem alterar a heurística):**
1. Se **nenhum** item estiver marcado: `showError("Selecione ao menos um ingrediente.")`, focar o primeiro checkbox, não renderizar tabela.
2. Se houver grupos ausentes: manter o aviso, mas torná-lo mais forte ("Estimativa incompleta: faltam X% da porção-alvo") e exibir também o **total-alvo** (`targetGrams`) ao lado do distribuído, com rótulos distintos ("Alvo diário", "Distribuído").
3. Ocultar/atenuar o card de kcal quando incompleto, ou rotulá-lo "kcal parcial (grupos faltando)".
**Aceite:** teste de navegador/DOM: zero seleção → mensagem de erro e foco; seleção parcial → aviso + alvo e distribuído visíveis e diferentes.

---

### F04 — Validação nativa × JS; campos ocultos inválidos; `step` (MÉDIA)

**Evidência:**
- `<form id="form">` não tem `novalidate`; a validação nativa dispara antes do handler JS e as mensagens customizadas nunca aparecem para limites de peso/idade.
- `#adultWeight` (sem `step`) usa step padrão 1: digitar `12.5` ⇒ `validity.stepMismatch === true` (confirmado) e o envio é bloqueado. O JS aceita decimais.
- Após corrigir F01, um campo oculto com valor inválido (ex.: usuário digitou idade 30, trocou para Adulto) faz o navegador bloquear o submit **sem mensagem** ("invalid form control is not focusable"). Reproduzido: resultado permaneceu inalterado.
**Correção:**
1. Ao alternar a fase, além de `hidden`, definir `disabled` nos `input/select` do bloco oculto (controles desabilitados não entram na validação nem no `FormData`).
2. Adicionar `novalidate` ao `<form>` e manter a validação única em JS (ver F13 para centralizá-la no módulo), com mensagens acessíveis (F09).
3. `#adultWeight`: `step=".1"`; `#age`: `step="1"` (meses inteiros; documentar) ou `step=".5"` e ajustar a validação.
**Aceite:** digitar idade 30, trocar para Adulto, enviar ⇒ cálculo ocorre normalmente; `adultWeight=12,5` aceito; peso `0` ⇒ mensagem do app (não bolha nativa).

---

### F05 — Filhote mais pesado que o adulto esperado (MÉDIA)

**Evidência:** peso 20 kg, adulto esperado 8 kg, 4 meses ⇒ app aceita; 8 % do peso, ≈ 2,0× RER (kcal/RER medido). Também não há checagem de coerência peso × idade.
**Correção:** em `calculations.js` (e refletir na UI): `if (weightKg > adultWeightKg * 1.1) throw new RangeError("weightKg exceeds expected adult weight")` (tolerância 10 % para estimativas imprecisas — constante nomeada e comentada como heurística). Na UI, mensagem: "O peso atual do filhote não pode ser maior que o peso adulto esperado." Teste: 3/8 kg OK; 20/8 kg lança `RangeError`; borda 8,8/8.
**Aceite:** o cenário 20 kg/8 kg mostra erro e não renderiza resultado.

---

### F06 — Percentual em degraus gera saltos de porção (MÉDIA — implementar apenas na forma abaixo)

**Evidência (cálculo com os módulos reais, mesma seleção):**

| Peso (kg) | % | g/dia |
|---|---|---|
| 2,9 → 3,1 | 8 → 5 | 232 → 155 (−33 %) |
| 34,9 → 35,1 | 4 → 3 | 1396 → 1053 (−25 %) |
| 10,0 → 10,1 | 4,5 → 4 | 450 → 404 |

Razão kcal/RER (RER = 70·kg^0,75) varia de 0,79 a 1,24 apenas por faixa de peso, sem justificativa clínica.
**Correção:** substituir os degraus de adulto por **interpolação linear** entre pontos-âncora (a faixa atual vira âncoras nos pontos médios), mantendo os valores atuais nos pontos centrais de cada faixa, de forma que a função seja contínua e monotônica não-crescente em peso. Manter comentário "heurística, sem validação clínica". Alternativa (preferível, mas **requer decisão humana**): método energético RER × fator; **não implementar sem aprovação**, apenas registrar em `docs/` como proposta.
**Aceite:** teste de continuidade (|pct(w+0,1) − pct(w)| ≤ 0,3 para w de 1 a 100) e de monotonicidade; testes antigos de adulto atualizados e justificados no histórico.

---

### F07 — Entradas inválidas silenciosas; código morto; teste enganoso (BAIXA)

**Evidência:** `estimatePercentage({weightKg:8, neutered:"banana", activity:"extreme"})` retorna 5,5 (trata "banana" como não castrado e "extreme" como moderado). `Math.max(2, …)` nunca atua (mínimo adulto = 2,5; filhote = 3,5), mas o teste "respects … adjustment floor" sugere o contrário (`50 kg, low` ⇒ 2,5, não o piso).
**Correção:** validar `neutered ∈ {"yes","no"}` e `activity ∈ {"low","moderate","high"}` (lançar `RangeError`); manter o piso como defesa explícita **ou** removê-lo e renomear o teste; adicionar testes de enum inválido e dos limites de faixa (3, 5, 10, 35 kg; idades 4, 6, 8, 10, 18 meses; adulto esperado 10, 25, 35 kg).
**Aceite:** novos testes verdes; nenhum teste com título que descreva comportamento inexistente.

---

### F08 — Contraste insuficiente (ALTA)

**Evidência (calculado):** botão tema escuro branco/`#8fd2a5` = **1,76:1** (exigido ≥ 4,5:1; visível no screenshot). `--muted` `#637368` sobre `--soft` `#e8f1e6` = **4,34:1** (abaixo de 4,5; afeta `.metric span` a 0,8 rem). Demais pares conferidos passam (botão claro 6,39; muted/bg 4,65; aviso 6,54; muted escuro/soft 6,45).
**Correção:** criar token `--on-green` (claro: `#fff`; escuro: `#0f1f16`) e usar `color:var(--on-green)` no `button`; escurecer `--muted` claro (ex.: `#56665b`) e **verificar por script** que todos os pares texto/fundo usados ≥ 4,5:1 (e 3:1 para texto grande e bordas de controle). Considerar `<meta name="theme-color">` com `media` para claro/escuro.
**Aceite:** script de contraste (pode ficar em `scripts/` fora do runtime) imprime todos os pares ≥ 4,5:1.

---

### F09 — Acessibilidade (MÉDIA)

**Evidência/Correções:**
1. `showError` renderiza `<p class="notice">` dentro de `aria-live="polite"`; erros devem usar `role="alert"` e **mover o foco** para o campo inválido (hoje só peso e percentual manual recebem foco; refeições e filhote não).
2. No mobile o resultado fica ~1.900 px abaixo do botão: após calcular, dar `tabindex="-1"` a um `<h3>` do resultado, focar e `scrollIntoView({block:"start"})` (respeitando `prefers-reduced-motion`).
3. Tabela: adicionar `<caption class="visually-hidden">`, `scope="col"` nos `th` do cabeçalho e `scope="row"` na linha "Total" (hoje usa `th` sem escopo).
4. Associar dicas aos campos com `aria-describedby` (`.hint` de percentual e de ingredientes); marcar `required` onde aplicável.
5. Definir `:focus-visible` explícito (outline ≥ 3:1) para input/select/button/summary — hoje depende do padrão do navegador.
6. `<link rel="icon" href="data:,">` (ou ícone real) para evitar 404 de `/favicon.ico`.
**Aceite:** navegação só por teclado completa o fluxo; leitor de tela anuncia erros; auditoria axe (ou Lighthouse a11y) sem violações críticas/sérias.

---

### F10 — Seletor por concatenação de strings (BAIXA)

**Evidência:** `index.html` linha 97 `document.querySelector('input[name="'+group.key+'"][value="'+item.id+'"]')`; quebra se `id`/`key` tiver aspas ou caracteres especiais e faz N consultas ao DOM.
**Correção:** ao montar os checkboxes, guardar `Map<id, HTMLInputElement>` (ou ler `selectedIds` via `[...form.querySelectorAll('input[type=checkbox]:checked')].map(i=>i.value)` → `Set`) e passar o `Set` a `buildPlan` (F02).
**Aceite:** nenhum `querySelector` com valores interpolados.

---

### F11 — Markdown quebrado em README e docs (MÉDIA)

**Evidência:** `README.md`, seção **Executar**: o parágrafo contém `\n\n```bash\n# Testes…` como texto literal e os cercados de código escapados (``\`\`\` ``) — a seção não renderiza como bloco de código. `docs/fase-01-pendencias.md` tem `\n-` literal no meio do histórico (entre "Evidência: … (commit `76a4a66`)…" e "- **31/10/2026:** resultados renderizados…", e na linha final).
**Correção:** substituir as sequências literais por quebras de linha reais e cercados ```` ```bash ```` reais; um item por linha no histórico. Não alterar o conteúdo semântico nem as datas.
**Aceite:** `grep -n '\\n' README.md docs/*.md` não retorna sequências literais; pré-visualização markdown mostra bloco de código.

---

### F12 — Conteúdo de segurança/nutrição (ALTA — **somente alterações de mensagem/rotulagem; valores ficam para revisão humana**)

**Evidência e ações:**
1. **Aviso de suplementação só no fim da página** (abaixo do resultado). Incluir dentro do painel de resultado, sempre que houver cálculo, um aviso fixo: "Resultado parcial e educativo: sem suplementação vitamínico-mineral orientada por veterinário esta combinação não é dieta completa (ex.: cálcio)." Sem dose.
2. **Modo filhote** não tem aviso específico. Filhotes, sobretudo de raças grandes, são sensíveis a erros de cálcio/fósforo. Exibir aviso destacado ao selecionar "Filhote" e no resultado: "Filhotes exigem formulação individual por veterinário." *(Se o responsável decidir desabilitar o modo filhote até a revisão técnica, é decisão humana — registrar como pendência, não implementar por conta própria.)*
3. **Fígado 5 %/dia** (`liver`, `chickenLiver`) é alimentado todos os dias na proporção fixa do grupo; fígado concentra vitamina A e cobre. Não há aviso. Adicionar nota na linha das vísceras e registrar em `docs/fase-01-pendencias.md` como item para revisão veterinária ("frequência/limite diário de fígado"). **Não** alterar `share`.
4. **Inconsistência de dados:** `liver` = "Fígado bovino **grelhado**" enquanto o app promete só alimentos "cozidos". Registrar como pendência de revisão de dados (não renomear nem trocar valores sem fonte).
5. **Rastreabilidade:** adicionar a cada item de `ingredients.js` os campos `source: null` e `verified: false` (sem inventar nada) e exibir na UI/rodapé "Valores de composição ilustrativos — fonte não verificada"; teste garantindo que `verified` é booleano e que nenhum `source` não nulo é adicionado sem origem (ou apenas checar presença do campo).
**Aceite:** os avisos 1–3 visíveis no navegador em modo adulto e filhote; nenhum valor numérico de `ingredients.js` ou `share` alterado (diff limitado a metadados).

---

### F13 — Validação do percentual manual e do perfil espalhada no HTML (MÉDIA)

**Evidência:** limites 0,5–120 kg, 2–12 %, refeições 1–4, idade 2–24, adulto 1–120 são repetidos no HTML (atributos `min/max` + JS inline), e `estimatePercentage` não conhece o percentual manual. Não há sanidade para manual muito distante do estimado (um cão de 120 kg a 12 % = 14,4 kg/dia).
**Correção:** criar `validateProfile(input)` e `resolvePercentage({manualPct, …})` em `src/calculations.js` (exportando constantes `LIMITS`), retornar mensagens pt-BR por campo (`{ok:false, field, message}`), usá-las no app (F04/F09) e testar todos os limites. Se `|manual − estimado| > 2 pontos percentuais`, exibir aviso (não bloquear): "O percentual manual difere muito da estimativa; confirme com seu veterinário."
**Aceite:** testes para cada limite (dentro/fora/NaN/vazio); HTML sem números de limite duplicados em JS.

---

### F14 — Infra e consistência documental (BAIXA)

1. Criar `.gitignore` (`node_modules/`, `.DS_Store`, `*.log`).
2. `package.json`: adicionar `"engines": {"node": ">=22"}` e, se desejado, `"description"`; não adicionar licença (pendência humana).
3. Opcional (devDependency permitida): teste de fumaça de navegador com Playwright cobrindo F01, F03, F04, F05 e executado em CI em job separado; manter `npm test` sem navegador funcionando.
4. CI: `push` em `feat/**` **e** `pull_request` para `main` duplicam execuções para PRs vindos de branches `feat/**`; aceitável, mas documentar ou restringir.
5. `docs/fase-01-pendencias.md`: marcar como parcialmente falsas/imprecisas as afirmações de que os testes cobrem "soma de macros e categorias ausentes" do app real (só cobriam código morto antes de F02) e registrar F01–F14 como novas pendências, separando o que a IA resolve e o que exige decisão humana. Manter os itens ainda abertos (fontes, licença, revisão veterinária, publicação) intactos.
**Aceite:** `npm test` verde em Node 22; docs coerentes com o código.

---

## 3. Pendências que **não** devem ser executadas pela IA (decisão humana)

- Licença de código/dados e atribuição das tabelas de composição.
- Revisão veterinária de fórmulas, faixas, limites (incluindo F06 alternativa energética e F12 itens 2–4).
- Substituição/validação de valores de composição e fontes (NRC, FEDIAF, AAFCO, WSAVA).
- Publicação/GitHub Pages.

## 4. Verificação final (checklist para a IA)

- [ ] `npm test` verde; novos testes para `buildPlan`, `computeEnergy`, `validateProfile`, enums, bordas de faixa e continuidade.
- [ ] No Chromium (desktop 1100 px e mobile 390 px; claro e escuro): campos corretos por fase; zero seleção bloqueada; seleção parcial sinalizada; filhote > adulto rejeitado; botão legível no tema escuro; avisos de F12 visíveis; sem erros no console; sem rolagem horizontal da página.
- [ ] Cenário padrão inalterado (360 g/dia; 337,5 kcal com todos os ingredientes) após a refatoração (exceto mudanças deliberadas de F06, documentadas).
- [ ] README/docs renderizam corretamente; checklist de `docs/fase-01-pendencias.md` atualizado com data e evidência.
