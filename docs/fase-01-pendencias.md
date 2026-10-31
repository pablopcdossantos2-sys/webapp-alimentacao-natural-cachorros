# Fase 01 — MVP inicial: pendências e validação

**Estado:** em desenvolvimento  
**Branch de trabalho:** `feat/mvp-calculadora-an-cozida`  
**Data de abertura:** 31/10/2026

Este documento será atualizado continuamente durante a fase. Pendências resolvidas devem permanecer no histórico, com data e evidência.

## Escopo desta fase
- Calculadora estática em HTML/CSS/JavaScript, sem servidor ou build.
- Perfil básico de cão e cálculo aproximado de porções.
- Seleção de ingredientes por grupos e estimativa de macros/energia.
- Interface responsiva e avisos educativos.
- Testes automatizados e revisão de acessibilidade/segurança.
- Preparação para publicação, sem publicar automaticamente.

## Pendências que a IA pode resolver
- [ ] Separar HTML, CSS, lógica de cálculo e dados em arquivos dedicados.
- [x] Remover interpolação HTML insegura da área de resultados; construir nós com DOM APIs e `textContent`.
- [x] Criar testes unitários para percentuais, divisão por categoria, soma de macros e categorias ausentes (Node.js `node:test`; CI configurada).
- [x] Extrair cálculo percentual para módulo testável e validar limites/entradas inválidas nos testes. A fórmula de porção permanece heurística e sem validação clínica.
- [ ] Conferir responsividade, labels, foco, contraste e navegação por teclado.
- [ ] Adicionar fontes rastreáveis aos dados dos ingredientes, sem inventar códigos ou atribuições.
- [x] Atualizar instruções de execução local e testes no README; corrigir a orientação incompatível de abrir diretamente via `file://`.
- [ ] Inspecionar o aplicativo renderizado em navegador e corrigir falhas observáveis.

## Pendências que exigem decisão/ação humana
- [ ] Confirmar autorização/licença para uso e adaptação de parâmetros provenientes de fontes de terceiros.
- [ ] Decidir licença do código e dos dados; manter indefinida até confirmação.
- [ ] Obter revisão técnica de médico-veterinário ou veterinário nutrólogo sobre fórmulas, limites, referências e mensagens.
- [ ] Confirmar quais tabelas de composição podem ser distribuídas e qual atribuição/licença aplicar.
- [ ] Aprovar publicação pública e ativação do GitHub Pages.
- [ ] Resolver eventuais divergências de referência (NRC/FEDIAF/AAFCO) com fontes primárias.

## Registro de decisões
- **31/10/2026:** escopo inicial restrito à AN cozida, sem ossos. O app é educativo, não prescreve dieta nem calcula doses de suplementos.
- **31/10/2026:** o repositório foi encontrado vazio; criado um README inicial em `main` como commit-base. O trabalho de implementação segue em branch separada, sem merge.
- **31/10/2026:** primeiro protótipo web foi adicionado à branch de trabalho. Ainda não está validado para uso ou publicação.

## Histórico de pendências resolvidas
- **31/10/2026:** extraído `estimatePercentage` para `src/calculations.js`, com testes de faixas adultas/filhotes e rejeição de valores inválidos; o app importa a função compartilhada. Evidência: commits `45a3833`, `acb001e`, `939e4b4`.
- **31/10/2026:** adicionados testes `node:test`, script `npm test` e workflow GitHub Actions para push/PR. Evidência: `tests/calculations.test.js`, `package.json`, `.github/workflows/tests.yml` (commit `76a4a66`). Execução do CI ainda depende do GitHub Actions após o push; não declarar validação clínica.\n- **31/10/2026:** resultados renderizados com criação de elementos DOM e `textContent`, sem interpolação de conteúdo em `innerHTML`; adicionada validação de faixa de peso, idade/peso adulto de filhote, número de refeições e percentual manual. Evidência: commit `560b7ea`.\n- **31/10/2026:** README ajustado para explicar que a importação de módulos requer servidor HTTP local; incluídos comandos de teste e servidor. Evidência: commit de atualização do README.
