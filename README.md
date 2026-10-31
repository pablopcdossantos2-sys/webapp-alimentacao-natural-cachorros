# Prato de Cão — Calculadora educativa de alimentação natural cozida

Webapp estático, em português, para estimativas educativas de porções e macronutrientes de alimentos cozidos para cães. Não prescreve dietas, não garante completude nutricional e não substitui médico-veterinário ou veterinário nutrólogo.

## Páginas

- **Calculadora** (`index.html`): estimativas matemáticas de porções e macronutrientes.
- **Guia educativo** (`guia-alimentacao-natural.html`): fundamentos de alimentação caseira cozida, equilíbrio nutricional, formulação, preparo seguro e limites da ferramenta.
- **Referências bibliográficas** (`referencias.html`): fontes organizadas em conformidade com a ABNT NBR 6023:2025.

## Interface

O modo escuro é o padrão inicial. O seletor no cabeçalho alterna entre modo escuro e claro e guarda a preferência localmente para mantê-la entre páginas e visitas no mesmo navegador.

## Segurança e limitações

Os percentuais, grupos, valores de composição e estimativas de energia da calculadora são heurísticos ou ilustrativos e não foram validados clinicamente. Os dados de composição continuam sem fontes verificadas. Não use os resultados para formular ou fornecer uma dieta sem avaliação individual de médico-veterinário ou veterinário nutrólogo.

Alimentação natural cozida sem suplementação vitamínico-mineral adequada não deve ser considerada completa. O aplicativo não calcula doses de suplementos. Filhotes, cães com doenças, gestantes/lactantes, neonatos e animais com necessidades clínicas exigem formulação individual. A seleção parcial não representa a porção-alvo diária completa.

Os valores dos ingredientes permanecem marcados com `source: null` e `verified: false`. Não foram inventadas permissões de redistribuição. A frequência e o limite de fígado, assim como a inconsistência de preparo de um ingrediente, continuam pendentes de revisão veterinária.

## Executar localmente

As páginas importam módulos JavaScript. Sirva o diretório por HTTP, em vez de abrir os HTMLs como `file://`. Requer Node.js 22 ou superior para executar testes e verificações.

```bash
npm test
npm run check:contrast
python -m http.server 8000
```

Acesse `http://localhost:8000`.

## GitHub Pages

O projeto é compatível com GitHub Pages: é uma aplicação estática em HTML, CSS e JavaScript, sem backend ou etapa de compilação. O workflow `.github/workflows/deploy-pages.yml` executa os testes, prepara as páginas e os módulos necessários e implanta o site a partir de `main`.

**Ativação inicial necessária:** em `Settings > Pages > Build and deployment > Source`, selecione `GitHub Actions`. Depois dessa configuração, cada push em `main` poderá publicar automaticamente.

Endereço esperado: https://pablopcdossantos2-sys.github.io/webapp-alimentacao-natural-cachorros/

O site será público. A publicação técnica não significa validação nutricional ou autorização para usar as estimativas como dieta.

## Verificação e pendências

`npm test` executa os testes com o runner nativo do Node.js. `npm run check:contrast` verifica pares de cores selecionados segundo WCAG AA. A inspeção real em Chromium (desktop/mobile, claro/escuro), axe/Lighthouse e a revisão veterinária permanecem necessárias. Não se deve declarar validação visual ou clínica sem essas evidências.

Consulte `docs/fase-01-pendencias.md` para o histórico, critérios de validação e pendências humanas.

## Licença

O código do projeto está sob GNU Affero General Public License v3.0; consulte `LICENSE`. Isso não presume que os valores nutricionais ou eventuais dados de terceiros tenham a mesma licença. A origem, as permissões e a atribuição desses dados continuam pendentes de confirmação.
