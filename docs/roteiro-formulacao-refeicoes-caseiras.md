# Roteiro técnico — evolução até refeições caseiras

**Objetivo:** transformar o Prato de Cão em uma ferramenta de apoio ao planejamento e preparo doméstico de refeições cozidas para cães, sem apresentar receitas como completas ou seguras antes de haver base nutricional rastreável e validação veterinária.

Este roteiro é incremental. A ferramenta não deve avançar para a geração de receitas utilizáveis apenas porque passou a calcular calorias.

## Princípios que não podem ser flexibilizados

1. A formulação parte do perfil e da necessidade energética individual, mas energia não é sinônimo de equilíbrio nutricional.
2. Cada nutriente essencial deve ser calculado em unidade compatível com a referência adotada, com mínimos, máximos e relações relevantes quando existirem.
3. Cada valor de composição deve ser rastreável ao ingrediente, corte, fração comestível, método de preparo, umidade e fonte.
4. Alterações de ingrediente, quantidade, cozimento ou suplemento precisam atualizar os cálculos e os avisos.
5. Situações especiais não podem receber uma receita adulta genérica.
6. Nenhuma receita será chamada de completa, balanceada ou pronta para uso sem validação por profissional habilitado.

## Módulo 01 — perfil e necessidades energéticas

**Estado:** implementado na interface e na lógica inicial; testes automatizados adicionados. Revisão visual e veterinária ainda pendentes.

- Perfil: peso atual, idade, raça informada, fase/situação, BCS, MCS, atividade e número de refeições.
- Cálculo de RER.
- Duas referências independentes para adultos saudáveis: fatores Merck e valores de atividade FEDIAF 2025.
- Fases especiais exibem apenas o RER e não recebem MER adulto.
- Não há multiplicadores automáticos de raça, BCS ou MCS.

**Critério para considerar concluído:** testes automatizados aprovados, inspeção desktop/mobile e revisão das mensagens e premissas por profissional veterinário.

## Módulo 02 — padrão nutricional e metas por nutriente

Antes de programar uma receita, definir com especialista:
- qual referência principal será usada (NRC, FEDIAF, AAFCO ou combinação justificada);
- como tratar a diferença entre recomendações para alimentos comerciais completos e necessidades de uma dieta caseira;
- quais fases de vida serão suportadas primeiro;
- unidade de cada meta (por 1.000 kcal de energia metabolizável, matéria seca, peso corporal ou outra unidade definida pela referência);
- mínimos, máximos toleráveis, relações e exceções;
- requisitos de aminoácidos essenciais, ácidos graxos, minerais, vitaminas, colina e outros nutrientes aplicáveis.

**Entrega:** motor de requisitos versionado, com fonte, tabela, unidade, faixa, fase de vida e justificativa para cada parâmetro. Não usar apenas proteína e gordura como prova de completude.

## Módulo 03 — base de composição dos ingredientes

- Escolher bases de composição adequadas e licenciáveis; tabelas de alimentos humanos podem ser apoio parcial, não substituto automático de dados específicos para cães.
- Registrar nome padronizado, espécie, corte, fração comestível, estado cru/cozido, método e tempo de preparo, umidade, rendimento e densidade energética.
- Distinguir dado medido, calculado, estimado e desconhecido.
- Guardar fonte, data de consulta, licença, unidade original e conversões aplicadas.
- Não preencher lacunas com zeros nem inferir valores sem marcar a incerteza.

**Entrega:** catálogo de ingredientes com proveniência completa e cobertura mínima definida pelo especialista.

## Módulo 04 — formulação quantitativa de receitas

- Converter a meta energética em restrições de formulação sem confundir calorias com quantidade de alimento.
- Calcular cada nutriente da receita e comparar com o padrão escolhido.
- Tratar cálcio:fósforo, aminoácidos, ácidos graxos, vitaminas, minerais e limites máximos.
- Calcular suplementos a partir da receita completa e da composição efetiva do produto; não oferecer dose genérica.
- Permitir substituições apenas quando o motor recalcular todos os nutrientes e comprovar equivalência dentro das margens.
- Explicar quais metas foram atendidas, excedidas ou não puderam ser avaliadas.

**Entrega:** receita em gramas e rendimento cozido, acompanhada de relatório de adequação, incertezas e fontes. A exportação para preparo doméstico só será habilitada após revisão.

## Módulo 05 — preparo doméstico, porcionamento e conservação

- Informar pesos antes/depois do preparo e rendimento real.
- Instruções reproduzíveis de higiene, cozimento, resfriamento, armazenamento e descongelamento.
- Separar ingredientes crus dos alimentos prontos e impedir ingredientes perigosos ou inadequados.
- Dividir em porções diárias e por refeição usando a receita já validada.
- Registrar lote, data de preparo, validade definida por orientação técnica e suplemento medido.

**Entrega:** ficha de preparo imprimível, lista de compras e plano de porcionamento, vinculados à versão exata da receita.

## Módulo 06 — acompanhamento e recalibração

- Histórico de peso, BCS, MCS, apetite, fezes e observações.
- Comparação entre energia estimada, quantidade realmente oferecida e evolução observada.
- Alertas para perda/ganho inesperado, mudanças clínicas e necessidade de reavaliação.
- Recalibração sugerida apenas como apoio à conversa com o veterinário; nunca alterar suplementos automaticamente sem validação.

**Entrega:** painel longitudinal e histórico das versões de receitas.

## Módulo 07 — validação e liberação

- Testes unitários e de integração para unidades, conversões, restrições e limites.
- Casos de teste revisados por nutricionista veterinário.
- Comparação independente de receitas-modelo e, quando possível, análise laboratorial.
- Auditoria de segurança alimentar, acessibilidade, usabilidade e proteção de dados.
- Revisão profissional documentada antes de habilitar exportação de receitas utilizáveis.

**Critério de liberação:** não basta o CI passar. O módulo precisa de revisão nutricional e validação dos dados.

## Próxima tarefa recomendada

Concluir a revisão visual/funcional do módulo 01 e, em paralelo, preparar uma matriz de requisitos para o módulo 02. A decisão sobre o padrão nutricional e a forma de aplicar as diretrizes a dietas caseiras deve ser tomada com profissional qualificado antes de codificar metas nutricionais definitivas.
