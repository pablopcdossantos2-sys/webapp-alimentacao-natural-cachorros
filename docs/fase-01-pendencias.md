# Fase 01 — MVP inicial: pendências e validação

**Estado:** em desenvolvimento; correções de código desta rodada implementadas, validação visual ainda pendente  
**Branch principal de manutenção:** `main`. A branch `feat/mvp-calculadora-an-cozida` foi consolidada nesta branch.  
**Data de atualização:** 31/10/2026

Pendências resolvidas permanecem no histórico, com data e evidência. Não confundir testes automatizados com validação veterinária ou inspeção visual no navegador.

## Escopo desta fase

- Calculadora estática em HTML/CSS/JavaScript, sem servidor ou build.
- Perfil básico de cão e cálculo aproximado de porções.
- Seleção de ingredientes por grupos e estimativa de macros/energia.
- Interface responsiva e avisos educativos.
- Testes automatizados e revisão de acessibilidade/segurança.
- Preparação para publicação, sem publicar automaticamente.

## Pendências que a IA pode resolver

- [x] Separar dados de ingredientes em `src/ingredients.js`.
- [x] Remover interpolação HTML insegura da área de resultados; construir nós com DOM APIs e `textContent`.
- [x] Centralizar cálculo de porção, distribuição, macros e energia em `src/calculations.js`; aplicativo importa `src/app.js`.
- [x] Cobrir com testes as funções realmente usadas pelo aplicativo, validação de perfil, enumerações, limites, seleção parcial e cálculo energético.
- [x] Impedir cálculo com seleção completamente vazia; sinalizar grupos ausentes e exibir alvo versus quantidade distribuída.
- [x] Unificar validação em JavaScript, desabilitar campos ocultos e aceitar pesos decimais.
- [x] Rejeitar filhote acima do peso adulto esperado com tolerância heurística de 10%.
- [x] Substituir degraus de percentual adulto por interpolação linear contínua entre âncoras, sem validação clínica.
- [x] Corrigir contraste dos botões e texto auxiliar; adicionar script de verificação WCAG.
- [x] Melhorar mensagens de erro, foco, anúncio de alertas, tabela acessível, foco visível e rolagem do resultado.
- [x] Substituir seletor CSS interpolado por leitura dos checkboxes marcados.
- [x] Corrigir quebras literais de Markdown no README e neste documento.
- [x] Adicionar avisos educativos para suplementação, filhotes e fígado; adicionar metadados `source`/`verified` sem inventar fontes.
- [x] Criar `.gitignore`, declarar Node.js mínimo 22 e documentar a duplicidade potencial de execuções do CI.
- [ ] Executar `npm test` e `npm run check:contrast` no ambiente de CI ou local e registrar os resultados observados.
- [ ] Verificar no Chromium desktop (1100 px) e mobile (390 px), temas claro/escuro: alternância de campos, seleção vazia/parcial, limites, avisos, foco, console e ausência de rolagem horizontal.
- [ ] Executar axe ou Lighthouse e corrigir violações críticas/sérias.
- [ ] Confirmar cenário padrão e comparar valores exibidos antes/depois da interpolação.

## Pendências que exigem decisão/ação humana

- [ ] Confirmar autorização/licença para uso e adaptação de parâmetros provenientes de fontes de terceiros.
- [x] Licença do código registrada como GNU AGPL v3 (`LICENSE`).
- [ ] Confirmar fontes, permissões e atribuição dos dados nutricionais; a licença do código não presume licença para os dados.
- [ ] Obter revisão técnica de médico-veterinário ou veterinário nutrólogo sobre fórmulas, limites, referências e mensagens.
- [ ] Confirmar quais tabelas de composição podem ser distribuídas e qual atribuição/licença aplicar.
- [ ] Revisar especialmente a heurística de percentual (inclusive a proposta energética RER × fator) e decidir se o modo filhote deve permanecer habilitado.
- [ ] Revisar frequência/limite diário de fígado com profissional veterinário.
- [ ] Resolver a inconsistência de preparo: `liver` permanece descrito como "Fígado bovino grelhado", embora o escopo da ferramenta fale em alimentos cozidos. Não alterar nome nem composição sem fonte.
- [x] Preparar workflow de publicação estática pelo GitHub Actions.
- [ ] Em `Settings > Pages`, selecionar `GitHub Actions` como fonte e confirmar a primeira implantação.
- [ ] Resolver eventuais divergências de referência (NRC/FEDIAF/AAFCO/WSAVA) com fontes primárias.

## Notas de implementação e limites

- A interpolação adulta preserva as médias atuais nos pontos centrais das faixas e reduz descontinuidades; é uma heurística matemática, não uma recomendação nutricional.
- A tolerância de 10% entre peso atual e peso adulto esperado do filhote é uma barreira de coerência de entrada, não um critério clínico.
- A seleção parcial mostra a fração não distribuída. A energia é omitida quando faltam grupos para evitar apresentar kcal parciais como total diário.
- Os metadados de composição são explicitamente `source: null` e `verified: false`. Nenhuma fonte foi inferida.
- O workflow de testes agora executa em `push` para `main` e em `pull_request` para `main`, rodando `npm test` e `npm run check:contrast`. O workflow de Pages só publica após push em `main` ou execução manual, e o deploy também repete as verificações.
- A publicação está preparada por workflow, mas depende da seleção única de `GitHub Actions` em `Settings > Pages` e de uma execução bem-sucedida. O código está sob AGPL-3.0; a licença dos dados de composição continua sem comprovação.

## Registro de decisões

- **31/10/2026:** escopo inicial restrito à AN cozida, sem ossos. O app é educativo, não prescreve dieta nem calcula doses de suplementos.
- **31/10/2026:** o repositório foi encontrado vazio; criado um README inicial em `main` como commit-base. A implementação começou em `feat/mvp-calculadora-an-cozida`; posteriormente, as duas linhas de histórico foram consolidadas em `main`.
- **31/10/2026:** primeiro protótipo web foi adicionado à branch de trabalho. O conteúdo consolidado está em `main`; a validação veterinária e a inspeção visual continuam pendentes.
- **31/10/2026:** a interpolação linear foi implementada apenas na forma prescrita no relatório; a alternativa energética continua dependente de decisão humana.
- **31/10/2026:** não foram alterados os valores nutricionais de composição nem as participações (`share`) dos grupos.

## Histórico de pendências resolvidas

- **31/10/2026:** os dados dos ingredientes foram extraídos para `src/ingredients.js` e o aplicativo passou a importá-los como módulo. Os valores continuam sem validação de fonte e não devem ser usados clinicamente. Evidência: commits `709bd8c` e `3f2fb5a`.
- **31/10/2026:** extraído `estimatePercentage` para `src/calculations.js`, com testes de faixas adultas/filhotes e rejeição de valores inválidos; o app importa a função compartilhada. Evidência: commits `45a3833`, `acb001e`, `939e4b4`.
- **31/10/2026:** adicionados testes `node:test`, script `npm test` e workflow GitHub Actions para push/PR. Evidência: `tests/calculations.test.js`, `package.json`, `.github/workflows/tests.yml` (commit `76a4a66`). Execução do CI ainda depende do GitHub Actions após o push; não declarar validação clínica.
- **31/10/2026:** resultados renderizados com criação de elementos DOM e `textContent`, sem interpolação de conteúdo em `innerHTML`; adicionada validação inicial de perfil. Evidência: commit `560b7ea`.
- **31/10/2026:** README ajustado para explicar que a importação de módulos requer servidor HTTP local; incluídos comandos de teste e servidor.
- **31/10/2026:** centralizada a lógica real do aplicativo em `src/calculations.js` e movida a interface para `src/app.js`; adicionados `dailyGrams`, `computeEnergy`, `buildPlan`, `missingGroups`, `validateProfile` e `resolvePercentage`. Evidência: commit `237b80e` e criação de `src/app.js` no commit `ed6d78d`.
- **31/10/2026:** corrigido o atributo `hidden`, campos de fase inativa desabilitados, validação nativa substituída por validação única em JS, mensagens de erro acessíveis e resultados com foco/rolagem. Evidência: commit `08251eb`.
- **31/10/2026:** percentuais adultos passaram a interpolar linearmente entre âncoras; validação de enums e coerência de peso de filhote adicionadas. Evidência: commit `237b80e`.
- **31/10/2026:** avisos de suplementação no resultado, aviso específico de filhote e nota sobre fígado adicionados; campos de proveniência incluídos sem alterar valores numéricos ou shares. Evidência: commit `59b0dc4`.
- **31/10/2026:** testes ampliados para funções efetivamente usadas pelo app e metadados de origem. Evidência: commit `a82c6e6`.
- **31/10/2026:** corrigidas sequências literais de quebra de linha no README e no documento de pendências; adicionado script de auditoria de contraste, incluído no CI junto dos testes; criado `.gitignore`; Node mínimo documentado. Evidência: commits `869575c`, `438ba70`, `719725e` e atualização deste documento.
