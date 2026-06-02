
## Objetivo
Eliminar completamente a dependência do Google Search Console (GSC) do projeto. Nenhuma tela, função ou fluxo deve mais exigir conexão com Google.

## O que será feito

### 1. Desconectar a conexão GSC do projeto
- Chamar `standard_connectors--disconnect` para a conexão "Ana's Google Search Console", removendo os secrets `GOOGLE_SEARCH_CONSOLE_API_KEY` do projeto (a conexão continua existindo no workspace, mas não é mais usada aqui).

### 2. Remover código que depende do GSC
- **`src/lib/gsc.functions.ts`** — deletar o arquivo inteiro (server functions `inspectURL`, `getIndexingStatus`, `getSearchAnalytics`).
- **`src/lib/seo-automation.ts`** — deletar (usa `inspectURL` do GSC).
- **`supabase/functions/sync-metrics/index.ts`** — deletar a edge function de sync que dependia do GSC.

### 3. Ajustar o SEO Dashboard para funcionar sem GSC
- **`src/routes/seo-dashboard.tsx`** — remover toda UI/lógica de "Indexing Status", "Inspect URL", "Request Indexing" e métricas vindas do GSC. Manter apenas:
  - Métricas internas (vindas da tabela `ab_events` / `daily_metrics` do nosso próprio banco)
  - Lighthouse (que é simulado e não depende do GSC)
  - GA4 metrics (já roda em cima do nosso Supabase, sem GSC)
- Substituir blocos de GSC por um aviso curto: "Indexação Google: gerenciada manualmente via Search Console externo".

### 4. Limpar imports e referências residuais
- Procurar (`rg`) por `gsc`, `GoogleSearchConsole`, `inspectURL`, `getIndexingStatus`, `seo-automation`, `GOOGLE_SEARCH_CONSOLE_API_KEY` em todo o projeto e remover qualquer import órfão.
- Remover qualquer botão/link tipo "Connect Google Search Console" da UI.

### 5. Não tocar
- Não vou mexer em design system, navbar, blog, cores — só na remoção do GSC.
- Não vou desconectar o Supabase / Lovable Cloud (isso continua sendo a base de dados do site).

## Resultado esperado
- Nada no app pede conexão com Google.
- O SEO Dashboard continua abrindo e mostrando os dados internos (eventos, leads, Lighthouse simulado), só sem o pedaço de "indexação Google".
- Nenhum erro de build por imports quebrados.

Posso executar?
