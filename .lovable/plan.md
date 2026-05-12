## Problema

Os pares antes/depois atuais não combinam: o "antes" é uma foto genérica do Unsplash (celeiro vermelho numa colina, casa desbotada qualquer) enquanto o "depois" é um projeto real da Siding Depot. Visualmente parecem casas diferentes — quebra a credibilidade do slider.

## Solução

Em vez de usar placeholders aleatórios do Unsplash, gerar a versão "antes" de cada foto real usando edição de imagem por IA. Mesma casa, mesmo ângulo, mesmo enquadramento — porém com sinais claros de desgaste pré-renovação:

- Siding antigo de vinil/madeira desbotado, manchado ou danificado
- Pintura descascando, mofo, áreas com remendos
- Cores apagadas, telhado/calhas envelhecidos
- Garagem e janelas no estado original (sem o acabamento novo)

Isso garante que ao arrastar o slider o usuário veja claramente a *mesma* casa transformada.

## Etapas

1. **Selecionar 2 fotos "depois"** já existentes em `public/projects/` que funcionem bem para o slider (ex.: `project-1.webp` e `project-5.webp` — fachadas frontais limpas).
2. **Gerar versões "antes"** com `imagegen--edit_image`, salvando em `public/projects/project-1-before.webp` e `project-5-before.webp`. Prompt focado em: manter exatamente a mesma casa/ângulo/enquadramento, alterar apenas o estado do revestimento, pintura e detalhes para parecer uma renovação pendente (siding desbotado, pintura descascando, sem trim novo).
3. **Atualizar `src/data/site.ts`**: trocar os URLs do Unsplash em `BEFORE_AFTER_PAIRS` pelos novos arquivos locais e ajustar os `beforeAlt` para refletir "mesma casa antes da renovação Siding Depot".
4. **QA visual**: revisar o slider na home (1340px) para confirmar coerência entre antes/depois.

## Arquivos afetados

- `public/projects/project-1-before.webp` (novo)
- `public/projects/project-5-before.webp` (novo)
- `src/data/site.ts` (editar `BEFORE_AFTER_PAIRS`)

Nenhuma mudança de componente — `BeforeAfterSlider.tsx` já consome os campos atuais.