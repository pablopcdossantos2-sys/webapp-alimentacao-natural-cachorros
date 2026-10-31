# Calculadora de Macronutrientes — Alimentação Natural Cozida para Cães

Webapp estático, em português, para estimativas educativas de porções e macronutrientes de alimentação natural cozida (sem ossos). O projeto não prescreve dietas, não garante completude nutricional e não substitui médico-veterinário ou veterinário nutrólogo.

## Escopo inicial

- Perfil do cão (adulto/filhote) e estimativa de quantidade diária.
- Seleção de ingredientes cozidos por categoria.
- Estimativa de porções, proteína, gordura, carboidratos, fibra e energia.
- Avisos para categorias sem ingredientes, suplementação e limitações dos dados.
- Interface responsiva, tema claro/escuro e execução via servidor HTTP local.

## Segurança e limitações

A estimativa depende de dados de composição e parâmetros de referência que precisam de validação técnica. Não use para cães com doenças, gestação/lactação, neonatos ou outras situações clínicas sem orientação veterinária. A AN cozida sem suplementação adequada não deve ser apresentada como dieta completa. O cálculo não determina doses de suplementos. A estimativa percentual, inclusive a interpolação e as regras para filhotes, é heurística e não validada clinicamente.

## Executar

A página importa módulos JavaScript; sirva o diretório por HTTP em vez de abrir o HTML como `file://`.

```bash
# Testes unitários (Node.js 22 ou superior)
npm test

# Servidor local simples (Python 3)
python -m http.server 8000
```

Depois, acesse `http://localhost:8000` no navegador.

## Dados e rastreabilidade

Os valores de composição estão marcados como não verificados (`source: null`, `verified: false`). Nenhuma fonte, código de tabela ou licença foi presumido. A revisão das fontes e permissões continua pendente.

## Publicação

O projeto não foi publicado nem teve o GitHub Pages ativado. Qualquer publicação depende de aprovação humana após revisão técnica e documental.

## Referências e atribuição

Antes de uma publicação ampla, revisar referências primárias (NRC, FEDIAF, WSAVA) e atribuição/licença das fontes de alimentação natural e tabelas de composição. A menção a essas entidades não significa que os parâmetros atuais tenham sido extraídos ou validados por elas.

## Licença

Ainda não definida. Não assumir licença de código ou de dados até resolver a pendência com os titulares relevantes.
