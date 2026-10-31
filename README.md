# Calculadora de Macronutrientes — Alimentação Natural Cozida para Cães

Webapp estático, em português, para estimativas educativas de porções e macronutrientes de alimentação natural cozida (sem ossos). O projeto não prescreve dietas, não garante completude nutricional e não substitui médico-veterinário ou veterinário nutrólogo.

## Escopo inicial

- Perfil do cão (adulto/filhote) e estimativa de quantidade diária.
- Seleção de ingredientes cozidos por categoria.
- Estimativa de porções, proteína, gordura, carboidratos, fibra e energia.
- Avisos de categoria sem ingredientes e informação sobre suplementação.
- Interface responsiva, tema claro/escuro e execução estática via servidor local ou GitHub Pages.

## Segurança e limitações

A estimativa depende de dados de composição e parâmetros de referência que precisam de validação técnica. Não use para cães com doenças, gestação/lactação, neonatos ou outras situações clínicas sem orientação veterinária. A AN cozida sem suplementação adequada não deve ser apresentada como dieta completa. O cálculo não determina doses de suplementos.

## Executar

A página importa um módulo JavaScript; por isso, sirva o diretório por HTTP em vez de abrir o HTML como `file://` (restrições de módulos do navegador). Não há build nem dependências externas.\n\n```bash\n# Testes unitários (requer Node.js 22 ou compatível)\nnpm test\n\n# Servidor local simples (Python 3)\npython -m http.server 8000\n```\n\nDepois, acesse `http://localhost:8000` no navegador.

## Publicação

Configure GitHub Pages em **Settings → Pages → Deploy from a branch**, selecione `main` e `/ (root)` após revisão e aprovação do projeto.

## Referências e atribuição

Os parâmetros de referência e os dados de composição precisam ser rastreáveis no app e nos documentos do projeto. Antes de uma publicação ampla, revisar referências primárias (NRC, FEDIAF, WSAVA) e atribuição/licença das fontes de alimentação natural e tabelas de composição.

## Licença

Ainda não definida. Não assumir licença de código ou de dados até resolver a pendência com os titulares relevantes.
