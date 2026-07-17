# 04 — CANAIS, CAMPANHAS ATIVAS E CONCORRENTES

## De onde vêm os clientes (561 respostas "onde ouviu falar", colhidas pelo time)
Neighborhood 79 · Referral 78 · Drive By 72 · **Google Ads 56** · Returning 49 ·
Wrapped Vehicles 43 · Website 39 · Facebook 23 · Re-Quote 23 · James Hardie 19 · Thumbtack 16.
**57% é orgânico local (presença física)** — obra gera obra. Densidade > alcance.
ATENÇÃO: o campo `source` automático do GHL diz "Google Ads = 1" — é ERRADO/incompleto;
usar o campo declarado (`where did you hear about`).

## Google Ads (conta operacional 398-485-4749 · histórica 507-739-5707)
Campanha ativa: **SD | SIDING | Search | 2026-07** (id 24038805301), lançada 16/07/2026:
- $120/dia · Maximizar cliques com teto CPC $15 · geo **Marietta apenas, Presença física**
- Grupo ativo: Marietta | Siding | Exact+Phrase (197955372186); RSA 197955372186~817244275847
  → URL `https://www.sidingdepot.com/marietta-ga-siding?utm_source=google&utm_medium=cpc&utm_campaign=marietta_siding`
- 8 keywords (3 exact + 5 phrase, todas com "marietta"); 24 negativas (jobs/diy/cheap/mobile home...
  + 9 de REPARO: repair, repairs, repairing, fix, fixing, patch, patching, restore, handyman)
- Recurso de chamada (678) 400-2012, relatório de chamadas ON, conversão "Calls from ads", 24/7
- 3 grupos antigos PAUSADOS apontam p/ URLs 404 (/siding/*) — NUNCA reativar como estão
- AI Max OFF · personalização de texto OFF · expansão de URL OFF — reavaliar 29/07-12/08/2026
- Pendências: conversões de ligação DUPLICADAS (2 ações primárias), parceiros de pesquisa ON,
  recursos incompletos (sitelinks/logo/nome), campanha "[SEARCH][FORM][31/03/26] - SERVICES"
  ENABLED na conta sem dono claro — auditar gasto.
- Conversão web: AW-16810687003 / label Q9xVCLq_h54cEJv0-s8- · evento `lead_submit` via GTM-KTZCGP8B.
  **Nenhuma conversão de Busca jamais registrada em produção** (é a 1ª campanha de Busca da conta)
  — o 1º lead pago valida o funil inteiro.
- LSA (Local Services Ads) ativo ~$1.000/semana: 159 leads em 2 anos, $166-320/lead conforme cidade.

## Meta Ads
Conta act_133749310327870 · Pixel 817385110735223 · app "SidingDepot ADM" (token 60d, renovação
agendada — ver 06). Facebook Ads = 25 opps no `source` automático; 23 no declarado.
ATENÇÃO: ao contar leads na API, somar SÓ `action_type == "lead"` (leadgen_grouped duplica;
erro real de 16/07: CPL $15 falso vs $78 real).

## Concorrentes (mapa de LPs auditado)
- **Dr. Roof**: domina roofing multi-cidade; **NÃO vende siding em Acworth nem Milton** (buraco);
  dono do cluster storm-damage em 9 cidades (nós não cobrimos — a página
  /storm-damage-siding-georgia existe no site e pode ancorar essa oferta com outro gatilho).
- **EXOVATIONS**: cobre siding nas 10 cidades — brigar com prova local (sede + 550 reviews + 24h;
  eles não prometem prazo).
- Dataset: `competitor_coverage.json` (82 linhas cidade×serviço).

## Site e páginas de aquisição
- Página oficial paga de Marietta: **/marietta-ga-siding** (aprovada; copy "based right here in
  Marietta... 20+ years"; meta sem repair). Está no sitemap; /lp/siding-marietta saiu.
- 3 páginas de Marietta no ar (canibalização conhecida): /marietta-ga-siding (oficial),
  /lp/marietta-siding (seção "Repair or replace?" pendente de decisão), /lp/siding-marietta.
- 10 LPs de cidade /lp/{cidade}-siding existem; 4 miram cidades vetadas pelos dados
  (Sandy Springs, Canton, Holly Springs, Milton).
