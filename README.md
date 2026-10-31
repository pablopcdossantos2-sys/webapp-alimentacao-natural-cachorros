# Calculadora de Macronutrientes — Alimentação Natural Cozida para Cães

Webapp estático, em português, para estimativas educativas de porções e macronutrientes de alimentação natural cozida (sem ossos). O projeto não prescreve dietas, não garante completude nutricional e não substitui médico-veterinário ou veterinário nutrólogo.

## Escopo inicial

- Perfil do cão (adulto/filhote) e estimativa de quantidade diária.
- Seleção de ingredientes cozidos por categoria.
- Estimativa de porções, proteína, gordura, carboidratos, fibra e energia.
- Avisos de seleção incompleta, suplementação e cuidados específicos com filhotes e vísceras.
- Interface responsiva, tema claro/escuro e execução estática via servidor local ou GitHub Pages.
- Regras de cálculo centralizadas em módulo JavaScript e testes automatizados.

## Segurança e limitações

A estimativa depende de dados de composição e parâmetros de referência que precisam de validação técnica. Não use para cães com doenças, gestação/lactação, neonatos ou outras situações clínicas sem orientação veterinária. A AN cozida sem suplementação adequada não deve ser apresentada como dieta completa. O cálculo não determina doses de suplementos.

Os percentuais e as distribuições são heurísticas educativas, não fórmulas clínicas validadas. A interpolação de percentual para adultos reduz saltos entre faixas, mas não foi validada por profissional. O modo filhote permanece experimental e exige formulação individual por veterinário.

Os dados de composição estão marcados com `source: null` e `verified: false`: não há rastreabilidade confirmada. Os valores não devem ser usados como fonte nutricional confiável.

## Executar

A página importa módulos JavaScript; por isso, sirva o diretório por HTTP em vez de abrir o HTML como `file://` (restrições de módulos do navegador). Não há build nem dependências externas de runtime. Requer Node.js 22 ou superior para testes e verificações.

```bash
# Testes unitários
npm test

# Auditoria de contraste WCAG dos pares de cores usados
npm run check:contrast

# Servidor local simples (Python 3)
python -m http.server 8000
```

Depois, acesse `http://localhost:8000` no navegador.

## Verificação

Os testes automatizados cobrem as funções de cálculo efetivamente usadas pelo aplicativo, validações, seleção integral/parcial, limites e metadados de rastreabilidade. A auditoria de contraste é executada separadamente por `npm run check:contrast` e também foi incluída no workflow do GitHub Actions.

A validação visual em Chromium desktop/mobile, nos temas claro/escuro, e a auditoria completa com axe/Lighthouse continuam necessárias antes de declarar a interface validada.

## Publicação

A publicação e a ativação do GitHub Pages permanecem bloqueadas até revisão humana e aprovação explícita. Não configurar publicação automaticamente.

## Referências e atribuição

Os parâmetros de referência e os dados de composição precisam ser rastreáveis no app e nos documentos do projeto. Antes de uma publicação ampla, revisar referências primárias (NRC, FEDIAF, WSAVA) e atribuição/licença das fontes de alimentação natural e tabelas de composição. Nenhuma fonte ou atribuição foi presumida nesta implementação.

## Licença

Ainda não definida. Não assumir licença de código ou de dados até resolver a pendência com os titulares relevantes.
