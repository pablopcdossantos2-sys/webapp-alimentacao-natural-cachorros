# Prato de Cão — apoio à formulação de refeições caseiras

Aplicação estática em HTML, CSS e JavaScript para apoiar, em etapas, o planejamento de refeições caseiras cozidas para cães. O módulo atual registra o perfil do animal e calcula referências iniciais de necessidade energética. Ainda não formula receitas, não calcula nutrientes completos e não deve ser usado como prescrição alimentar.

## Páginas

- **Calculadora** (index.html): perfil do cão, RER e estimativas energéticas iniciais para adultos saudáveis.
- **Guia educativo** (guia-alimentacao-natural.html): fundamentos nutricionais, formulação, segurança alimentar e limites da ferramenta.
- **Referências** (referencias.html): bibliografia de apoio organizada segundo a ABNT NBR 6023:2025.
- **Roteiro técnico** (docs/roteiro-formulacao-refeicoes-caseiras.md): fases, dependências e critérios para evoluir até o apoio à preparação de refeições caseiras.

## Módulo 01 — perfil e energia

O formulário registra peso atual, idade, raça informada, fase/situação de vida, escore de condição corporal (BCS), condição muscular (MCS), número de refeições, perfil selecionado para a equação Merck e atividade usada na referência FEDIAF 2025.

Para cães adultos saudáveis, são exibidos dois métodos independentes:

- RER = 70 × peso em kg elevado a 0,75.
- Merck: RER multiplicado por 1,6 (adulto castrado), 1,8 (adulto inteiro) ou 1,4 (propenso à obesidade).
- FEDIAF 2025: referência em kcal de energia metabolizável por kg elevado a 0,75, conforme a atividade: 95 (pouca atividade), 110 (moderada/baixo impacto), 125 (moderada/alto impacto) ou 150–175 (muita atividade).

Não se calcula média entre os dois métodos. Os resultados são referências iniciais, não metas clínicas. A condição corporal, a condição muscular e a evolução do peso contextualizam a avaliação, mas não alteram automaticamente os multiplicadores.

Para filhotes, idosos, gestação, lactação e condições clínicas, o módulo mostra apenas o RER como referência de repouso e não estima o MER. Uma formulação específica dessas fases requer lógica própria e revisão veterinária.

## Limites de segurança

- RER não é uma porção diária nem informa a quantidade de alimento.
- kcal por refeição é apenas a divisão aritmética da referência diária pelo número de refeições.
- A raça é registrada, mas não recebe multiplicador automático.
- O sistema não estima peso ideal, não diagnostica condição corporal e não ajusta energia automaticamente por BCS/MCS.
- Ainda não há cálculo de aminoácidos, ácidos graxos, vitaminas, minerais, fibras, biodisponibilidade, relação cálcio:fósforo ou limites máximos toleráveis.
- Não são calculadas quantidades em gramas de ingredientes nem doses de suplementos.
- Os dados de composição de ingredientes existentes no código antigo continuam sem fonte comprovada e não são usados pelo novo fluxo da calculadora.

Uma dieta caseira principal precisa ser formulada individualmente por médico-veterinário com competência em nutrição veterinária. O projeto não deve gerar uma receita alimentar utilizável até que a base de nutrientes, as fontes de composição, as regras de preparo e a validação técnica estejam prontas.

## Executar localmente

As páginas importam módulos JavaScript. Sirva o diretório por HTTP em vez de abrir os HTMLs com o protocolo file. Requer Node.js 22 ou superior para testes e verificações.

    npm test
    npm run check:contrast
    python -m http.server 8000

Acesse http://localhost:8000.

## GitHub Pages

O projeto é estático e não precisa de backend nem de etapa de build. O workflow de deploy publica a partir de main após executar as verificações.

Site: https://pablopcdossantos2-sys.github.io/webapp-alimentacao-natural-cachorros/

A publicação do site não significa validação nutricional ou autorização para usar os números em decisões alimentares.

## Verificação e pendências

- npm test: testes automatizados das funções do protótipo e do módulo energético.
- npm run check:contrast: verificação dos pares de cores selecionados segundo WCAG AA.
- Ainda são necessárias inspeção visual desktop/mobile, testes de acessibilidade com axe/Lighthouse e revisão veterinária independente.
- Consulte docs/fase-01-pendencias.md e docs/roteiro-formulacao-refeicoes-caseiras.md.

## Licença

O código está sob GNU Affero General Public License v3.0 (AGPL-3.0); consulte LICENSE. Isso não presume que os dados de composição ou conteúdos de terceiros tenham a mesma licença. Origem, permissões e atribuição dos dados continuam sujeitas a confirmação.
