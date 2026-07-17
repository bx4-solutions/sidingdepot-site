# 05 — PLATAFORMAS, IDs E INTEGRAÇÕES
ATENÇÃO: este arquivo NÃO contém credenciais — só identificadores. Chaves ficam em arquivos
locais citados no 06 e nas envs da Vercel/Supabase. NUNCA colar chave em chat/projeto.

## GoHighLevel (o CRM real — a interface ClickOne conversa com ele)
- **Produção: location `VPwAmJKkB62wR0BJhYil`** ("Siding Depot LLC", 3036 Roswell Rd)
- Sandbox de testes: "Beyond Group" `B0l3tI1dcYqo5f9Uh9W1` — a chave do `.env` do site é a SANDBOX
- Pipeline: **"1- LEADS PIPELINE"** `wARRRg993VXr6Jj87SmG` · stage de entrada "New Lead"
  `736cfe33-b219-45fd-9d3e-626272990a53`
- ~815 oportunidades; paginação: `startAfter` + `startAfterId`, 100/página
- Custom fields de OPORTUNIDADE (ID → significado):
  `DUmUaVf5pqjKjUdhzQFf` Postal Code (77% preenchido) · `O8JOb8ENnek61UnHf8er` City (92%) ·
  `hHA3fqMoMRNp9qUx4VfF` Street Address (77%) · `FXCxv8a1lmY6TIgq2woK` Current Siding? (65%;
  Wood (cedar)/LP/Vinyl/Fiber cement/Aluminum Siding/Other) · `G8avtemoWX6GsdAL0oOh` Year House
  Built? (65%; 1940→2025 de 5 em 5) · `u3yDLAw54k9hVLDgzWBB` where did you hear about (70%) ·
  `rDM05VB5JQnk8N9YCSI4` Squares (16%) · `PYg1kelTunBpEod9l08f` CLOSE DATE · `kz7Lrpby0dpQTSyVJ0U9`
  Service Details · `yMa64BMUDpg4CgrwUlLj` Services (checkbox: Siding/Painting/Windows/Doors/
  Gutters/Decks/Roof/Dumpster Rental)
- Convenções do funil (acordadas com o dono): nome da oportunidade = SÓ o nome do cliente;
  Fonte = canal + cidade ("Google Ads — Marietta"; "Meta Paid" traduz p/ "Facebook Ads");
  Tag = nome da página (ex. `marietta siding lp`) + `new_lead` (dispara automação que responde
  sozinha — editável em Automation no GHL).
- Detecção de canal no site (`deriveSourcePlatform`): gclid→Google Ads · fbclid→Meta Paid ·
  utm_source lsa/gmb/instagram/facebook · senão Direct. 18 campos de atribuição gravados por lead.
- API: `services.leadconnectorhq.com`, headers `Version: 2021-07-28` + **User-Agent de navegador**
  (sem ele o Cloudflare devolve 403 erro 1010).
- ClickOne AI (camada própria): https://clickone-ai.vercel.app — engine de automações + MCP
  (health: /api/mcp). Projeto local: /Users/severinobione/CLICKONE.AI_2026/frontend.
  O MCP "clickone" de deals/contatos está VAZIO — não é a fonte de dados comerciais.

## Supabase (produção)
- Projeto **`aknsfhxjmwvtxzrfmssk`** ("SidingDepot", conta bionicaosilva@gmail.com)
- Tabelas: `leads` (INSERT server-side com service-role — insert client-side falhava em silêncio),
  `analytics_events` (pageview/page_exit; geo via ipapi.co — NULL = consulta falhou),
  `google_ads_*` e `meta_ads_*` (read models do dashboard; sync MORTO desde 13/07 — cron),
  schema **`market_intel`** (migration `20260717120000` pronta; seed transacional 965 linhas;
  view `agent_brief`) — CARGA PENDENTE: backup → staging → produção. Não carregar direto.

## Site e infraestrutura
- sidingdepot.com: TanStack Start + React 19 + Vite 7 + bun. Deploy SÓ via
  `bash scripts/deploy-vercel.sh` na conta **bx4usa** (projeto prj_kTYtMdpxPV7T4XCjRbtBN3QGIe5N,
  alias sidingdepotv3.vercel.app). Conta bionicaosilva = projeto ERRADO.
  O script tem prompt interativo: rodar com `echo "y" |`. Build local trava — a Vercel valida.
- Dashboard: app.sidingdepot.com (Vercel team bionicaosilva-2000s-projects, deploy CLI --archive=tgz).
- Rastreamento: GTM próprio **GTM-KTZCGP8B** (conta "Siding Depot" 6366491361 / container 258559619);
  tags: Google Ads base + conversão (AW-16810687003 / Q9xVCLq_h54cEJv0-s8-), Conversion Linker,
  Meta Pixel base+Lead (817385110735223); gatilho `CE - lead_submit`.
  GA4 NÃO existe — decisão do dono (dashboard próprio no lugar). Não instalar sem ele pedir.
- Fluxo do lead: form → leads.ts → server fn → Supabase + GHL (contato+oportunidade+conversa) →
  `trackLeadSubmit()` → dataLayer `lead_submit` → GTM → Ads/Meta.
- Crons Vercel (vite.config): 4 declarados, plano Hobby aceita 2 → `google-ads:sync` (07:30) e
  `meta-ads:sync` (07:45) NUNCA rodam desde 13/07. Corrigir: reduzir a 2 ou upgrade Pro.
- Windsor.ai MCP (Google/Meta Ads API): ações de escrita SEM geo/URL-final/assets — essas só no painel.

## Google (outros)
- GSC: monitorar /marietta-ga-siding (entrou no sitemap 16/07; pedir indexação).
- GBP ativo com reviews reais. LSA ligado ao perfil, ~$1.000/semana.
