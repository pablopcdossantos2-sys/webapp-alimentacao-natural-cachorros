# Prato de Cão — Calculadora educativa de alimentação natural cozida

Webapp estático, em português, para estimativas educativas de porções e macronutrientes de alimentos cozidos para cães. Não prescreve dietas, não garante completude nutricional e não substitui médico-veterinário ou veterinário nutrólogo.

## Escopo

- Perfil de cães adultos e filhotes e estimativa heurística da quantidade diária.
- Seleção de ingredientes por grupo.
- Estimativa de porções, proteína, gordura, carboidratos, fibra e energia.
- Avisos para seleção incompleta, suplementação, filhotes e vísceras.
- Interface responsiva, tema claro/escuro e módulos JavaScript sem dependências de runtime.
- Testes automatizados das regras de cálculo e auditoria automatizada de contraste.

## Segurança e limitações

Os percentuais, grupos, valores de composição e estimativas de energia são heurísticos ou ilustrativos e não foram validados clinicamente. Os dados de composição continuam sem fontes verificadas. Não use os resultados para formular ou fornecer uma dieta sem avaliação individual de médico-veterinário ou veterinário nutrólogo.

Alimentação natural cozida sem suplementação vitamínico-mineral adequada não deve ser considerada completa. O aplicativo não calcula doses de suplementos. Filhotes, cães com doenças, gestantes/lactantes, neonatos e animais com necessidades clínicas exigem formulação individual. A seleção parcial não representa a porção-alvo diária completa.

Os valores dos ingredientes permanecem marcados com `source: null` e `verified: false`. Não foram inventadas referências, fontes ou permissões de redistribuição. A frequência e o limite de fígado, assim como a inconsistência de preparo de um ingrediente, continuam pendentes de revisão veterinária.

## Executar localmente

A página importa módulos JavaScript. Sirva o diretório por HTTP, em vez de abrir `index.html` como `file://`.

Requer Node.js 22 ou superior para executar testes e verificações.

```bash
npm test
npm run check:contrast
python -m http.server 8000
```

Acesse `http://localhost:8000`.

## GitHub Pages

O projeto é compatível com GitHub Pages: é uma aplicação estática em HTML, CSS e JavaScript, sem backend ou etapa de compilação. O workflow `.github/workflows/deploy-pages.yml` executa os testes, prepara um diretório de publicação mínimo e implanta o site a partir de `main`.

**Ativação inicial necessária:** em `Settings > Pages > Build and deployment > Source`, selecione `GitHub Actions`. Depois dessa configuração, cada push em `main` poderá publicar automaticamente.

Endereço esperado: https://pablopcdossantos2-sys.github.io/webapp-alimentacao-natural-cachorros/

O site será público. A publicação técnica não significa validação nutricional ou autorização para usar as estimativas como dieta.

## Verificação e pendências

`npm test` executa os testes com o runner nativo do Node.js. `npm run check:contrast` verifica pares de cores selecionados segundo WCAG AA. A inspeção real em Chromium (desktop/mobile, claro/escuro), axe/Lighthouse e a revisão veterinária permanecem necessárias. Não se deve declarar validação visual ou clínica sem essas evidências.

Consulte `docs/fase-01-pendencias.md` para o histórico, critérios de validação e pendências humanas.

## Licença

O código do projeto está sob GNU Affero General Public License v3.0; consulte `LICENSE`. Isso não presume que os valores nutricionais ou eventuais dados de terceiros tenham a mesma licença. A origem, as permissões e a atribuição desses dados continuam pendentes de confirmação.
