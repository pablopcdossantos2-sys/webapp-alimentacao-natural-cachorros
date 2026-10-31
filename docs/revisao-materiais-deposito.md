# Revisão crítica dos materiais de `deposito/`

**Data da revisão:** 31/10/2026  
**Destino dos originais:** `deposito/usados/`  
**Objetivo:** identificar conteúdo útil para melhorar o material educativo do Prato de Cão, distinguindo fontes acadêmicas, políticas veterinárias e textos de divulgação. Esta revisão editorial não equivale a parecer veterinário.

## Inventário e avaliação

| Arquivo original | Tipo / natureza | O que foi aproveitado | Limitações e decisão |
|---|---|---|---|
| `Alimentação natural para cães e gatos - Benefícios e riscos.pdf` | Andrade e Meneguelli (2025), revisão narrativa publicada em *Research, Society and Development* | Contexto sobre benefícios potenciais, riscos, necessidade de formulação e suplementação | Revisão narrativa, não ensaio clínico controlado. Alegações gerais sobre imunidade, longevidade ou prevenção de doenças não foram convertidas em promessas. Incluída na bibliografia como contexto, com ressalva metodológica. |
| `Alimentação natural para cães e gatos.pdf` | Saad e França (2010), artigo de revisão na *Revista Brasileira de Zootecnia* | Discussão histórica sobre composição de alimentos, formulação caseira e riscos microbiológicos | Fonte antiga; útil para contexto, mas não para parâmetros atuais de formulação, proporções ou doses. O texto discute limitações dos dados de composição e contaminação de dietas. Incluída na bibliografia com ressalva temporal. |
| `V-A - Alimentação natural na dieta dos cães.pdf` | Akamine et al. (2023), revisão publicada em *PUBVET* | Síntese de temas como equilíbrio nutricional, cálcio/fósforo, necessidades individuais e riscos sanitários | Revisão de literatura; o artigo também contém percentuais e sugestões de alimentos/ossos que não devem ser tratados como consenso ou prescrição universal. Não foram copiados percentuais de peso, proporções de vísceras ou recomendações de dieta crua. Incluída na bibliografia como revisão. |
| `anclivepa-sp.org.br-Alimentação Natural para Cães Benefícios e Dicas Essenciais.pdf` | Reprodução de artigo educativo da ANCLIVEPA-SP (2024) | Reforço da importância de orientação profissional, pesagem dos ingredientes e cuidados com alimentos inadequados | Página de divulgação, com conteúdo promocional e um cronograma percentual de transição. O cronograma não foi adotado como regra universal. Não foi adicionada como evidência científica independente. |
| `caesegatos.com.br-Alimentação natural para pets benefícios riscos e mitos.pdf` | Reprodução de matéria jornalística do Portal Cães & Gatos (2025) | Contextualização da discussão pública sobre benefícios e riscos e identificação da revisão de 2025 | É, em grande parte, uma divulgação da revisão de Andrade e Meneguelli, não uma fonte independente que a confirme. Não foi contabilizada como evidência adicional. |
| `ecycle.com.br-Alimentação natural para cães dicas e cuidados.pdf` | Reprodução de conteúdo editorial de divulgação | Identificação de temas que exigem resposta crítica, como composição, transição e segurança | Contém alegações amplas de prevenção de doenças e números genéricos sobre percentuais de ingredientes e vísceras. Essas afirmações não foram adotadas como orientação nutricional nem como evidência clínica. |
| `purina.com.br-Alimentação natural para cães guia de escolhas e nutrição segura.pdf` | Conteúdo de marca/comercial, datado de 10/09/2026 | Distinção geral entre alimentos frescos e formulações completas e balanceadas | Fonte comercial, com conteúdo de marca e promoção de produtos. Não foi usada para validar necessidades, ingredientes, doses ou vantagens clínicas. |
| `text.txt` | Arquivo de texto de 1 byte | Nenhum | Sem conteúdo útil para leitura ou incorporação. |

## Síntese das decisões aplicadas ao webapp

### 1. O guia educativo foi ampliado

Foram acrescentadas explicações sobre:

- Diferença entre variedade de ingredientes e adequação nutricional completa.
- Nutrientes que precisam ser avaliados em conjunto, incluindo aminoácidos, ácidos graxos, vitaminas, minerais, energia e fibras.
- Importância do cálcio e fósforo, com alerta contra correções improvisadas com casca de ovo, farinha de ossos ou suplementos.
- Diferença entre benefícios potenciais e resultados clínicos comprovados. O guia não promete que AN previna ou trate doenças.
- Riscos microbiológicos adicionais de carnes cruas ou malcozidas e riscos para pessoas que manipulam o alimento.
- O fato de que cozinhar reduz riscos microbiológicos, mas não torna a receita nutricionalmente completa; congelar não equivale a esterilizar.
- Planejamento profissional, execução fiel da receita, suplementação individualizada e acompanhamento.
- Transição individualizada, sem impor percentuais ou um calendário fixo universal.

### 2. A calculadora recebeu limites mais explícitos

Os percentuais removidos dos nomes dos grupos continuam existindo internamente como `share` para a demonstração matemática. Eles não foram recalculados nem validados, e agora são descritos como divisões internas do protótipo, não como proporções recomendadas. O parâmetro baseado no peso também foi identificado como heurístico, não como meta clínica. Os valores de composição permanecem com `source: null` e `verified: false`.

### 3. Referências adicionadas

Foram acrescentadas à página bibliográfica:

- Akamine et al. (2023), revisão em *PUBVET*.
- American Veterinary Medical Association, política sobre proteínas animais cruas ou malcozidas.
- Andrade e Meneguelli (2025), revisão narrativa em *Research, Society and Development*.
- Saad e França (2010), revisão na *Revista Brasileira de Zootecnia*.

A matéria do Portal Cães & Gatos não foi contada como fonte independente por resumir a revisão de 2025. As páginas de divulgação da ANCLIVEPA-SP, eCycle e Purina não foram usadas como base para proporções, doses ou alegações clínicas.

## Limites que permanecem

- O guia e a interface ainda precisam de revisão técnica por médico-veterinário com qualificação em nutrição veterinária.
- A origem e a autorização de redistribuição dos dados de composição da calculadora permanecem sem confirmação.
- Os arquivos originais foram preservados em `deposito/usados/`; movê-los não significa endossar seu conteúdo.
