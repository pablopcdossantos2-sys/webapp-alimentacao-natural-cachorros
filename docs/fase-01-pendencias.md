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
- [ ] Remover interpolação HTML insegura; construir resultados com DOM APIs e `textContent`.
- [ ] Criar testes unitários para percentuais, divisão por categoria, soma de macros e categorias ausentes.
- [ ] Validar a aritmética e os limites/entradas inválidas; documentar pressupostos.
- [ ] Conferir responsividade, labels, foco, contraste e navegação por teclado.
- [ ] Adicionar fontes rastreáveis aos dados dos ingredientes, sem inventar códigos ou atribuições.
- [ ] Revisar README, instruções locais e checklist de GitHub Pages.
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
- Nenhuma pendência técnica marcada como resolvida nesta abertura. Registrar aqui a data e o commit/resultado de cada resolução.
