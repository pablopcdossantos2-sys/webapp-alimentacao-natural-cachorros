# Fase 01 — MVP inicial: pendências e validação

**Estado:** em desenvolvimento
**Branch de referência:** `main`
**Data de atualização:** 31/10/2026

## Escopo
- Aplicativo estático em HTML/CSS/JavaScript, sem dependências de runtime.
- Perfil básico, estimativa educativa, seleção de ingredientes e macros.
- Interface responsiva, acessibilidade, testes automatizados e avisos de segurança.

## Pendências que exigem decisão/ação humana
- [ ] Confirmar autorização/licença para uso e adaptação dos parâmetros de terceiros.
- [ ] Definir licença do código e dos dados; não presumir autorização.
- [ ] Obter revisão veterinária das fórmulas, faixas, limites e mensagens.
- [ ] Validar fontes e permissões das tabelas de composição.
- [ ] Revisar frequência/limite diário de fígado.
- [ ] Revisar divergência de preparo: fígado bovino está rotulado como “grelhado”, embora o escopo prometa alimentos cozidos.
- [ ] Decidir se a calculadora deve permanecer habilitada para filhotes após revisão veterinária.
- [ ] Aprovar eventual publicação e ativação do GitHub Pages.

## Pendências técnicas
- [x] Centralizar cálculos e validações em `src/calculations.js`.
- [x] Corrigir visibilidade dos campos por fase e desabilitar campos ocultos.
- [x] Bloquear cálculo sem ingredientes e identificar grupos ausentes.
- [x] Exibir alvo diário e quantidade distribuída separadamente.
- [x] Adicionar validação de coerência de peso de filhote (heurística de 10%, não validada).
- [x] Substituir degraus adultos por interpolação linear entre âncoras; heurística sem validação clínica.
- [x] Validar enums, perfil e percentual manual no módulo.
- [x] Melhorar contraste, foco, mensagens de erro, tabela e navegação até resultado.
- [x] Adicionar rastreabilidade explícita sem inventar fontes (`source: null`, `verified: false`).
- [x] Corrigir Markdown e adicionar configuração mínima de Node/CI.
- [ ] Executar auditoria visual real em Chromium (desktop/mobile, claro/escuro) e axe/Lighthouse.
- [ ] Verificar no navegador ausência de erros de console e rolagem horizontal.

## Registro de decisões e histórico
- **31/10/2026:** escopo inicial restrito à alimentação natural cozida, sem ossos. O app é educativo e não calcula doses de suplementos.
- **31/10/2026:** parâmetros de composição e percentuais de grupos foram preservados; nenhuma fonte ou licença foi inventada.
- **31/10/2026:** os percentuais adultos passaram a interpolar linearmente entre pontos médios das faixas anteriores. A estimativa continua sendo heurística não validada clinicamente.
- **31/10/2026:** o limite de coerência de peso do filhote usa tolerância heurística de 10%; requer aprovação veterinária.
- **31/10/2026:** o percentual manual com diferença superior a 2 pontos percentuais gera aviso, sem bloqueio.

## Histórico de pendências resolvidas
- **31/10/2026:** F01 corrigido com regra explícita para `[hidden]`; alternância de fase também desabilita controles ocultos.
- **31/10/2026:** F02 corrigido: cálculo diário, distribuição, soma de macros, energia e plano passaram a ser funções puras importadas pelo app; novos testes cobrem o caminho usado pela interface.
- **31/10/2026:** F03 corrigido: zero seleção bloqueia o cálculo; grupos ausentes exibem participação faltante, alvo e distribuição parcial.
- **31/10/2026:** F04/F13 corrigidos: validação centralizada no módulo, formulário com `novalidate`, limites decimais e validação dos campos ativos.
- **31/10/2026:** F05/F06/F07 tratados com validação heurística de peso, interpolação adulta e rejeição de enums inválidos.
- **31/10/2026:** F08/F09 tratados com tokens de contraste, foco visível, alertas, foco/rolagem do resultado e semântica de tabela.
- **31/10/2026:** F10 corrigido com mapa de referências aos checkboxes, sem seletor CSS construído por concatenação.
- **31/10/2026:** F11 corrigido: README e este documento usam quebras de linha e cercados Markdown reais.
- **31/10/2026:** F12 tratado apenas em mensagens/rotulagem; valores de ingredientes e shares não foram alterados.
- **31/10/2026:** F14 tratado com `.gitignore`, `engines.node >=22` e CI restrita a push em main e PR para main.
- **Limitação de verificação:** os testes foram adicionados, mas sua execução e a auditoria em navegador precisam ser confirmadas no ambiente de CI/navegador; não declarar validação visual ou clínica sem evidência.
