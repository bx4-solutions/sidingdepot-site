# 06 — ROTINAS, TAREFAS AGENDADAS E CHECKLISTS

## Tarefas agendadas EXISTENTES (Claude Code scheduled-tasks, máquina do dono)
1. **relatorio-diario-ads-sidingdepot — 07:00, diário, EM PORTUGUÊS**
   Meta Ads (insights ontem + 7d; leads = SÓ action_type=="lead") + Google Ads (GAQL via OAuth
   puxado de `vercel env pull`, apagar o arquivo depois) + GHL (contatos novos por UTM,
   User-Agent de navegador). Credenciais Meta/GHL: arquivo local
   `~/.claude/projects/.../credentials/meta-ads-credentials.env` (chmod 600, fora de git).
   Nunca engolir erro de API — reportar a falha, não zero.
2. **renovar-token-meta-ads** — renova o token 60d da Meta (fb_exchange_token) antes de vencer
   (vencimento atual: 2026-09-11; app "SidingDepot ADM"). Atualiza o .env local, reporta datas,
   nunca expõe o token.
3. **clickone-automation-check-8am** — roda o engine de automações do ClickOne
   (POST clickone-ai.vercel.app/api/automations/run) + health do MCP e reporta.

## Rotinas a ATIVAR (dependem do dono)
- **Refresh diário da base de mercado**: `docs/market-intelligence/refresh.py` (retry, --dry-run,
  sanity check >20% de queda aborta, escrita atômica, refresh.log). BLOQUEADO: precisa da GHL
  API key de PRODUÇÃO (a do .env é sandbox). Agendar via pg_cron/edge function.
- **Carga do market_intel no Supabase**: backup → staging → migration → seed → validar → produção.
- Consertar os 2 crons Vercel mortos (google-ads:sync / meta-ads:sync).

## Checklist diário do agente (junto do relatório das 7h)
1. Campanha 24038805301: status (aprovada? "Não qualificada" some após aprovação), gasto,
   cliques, termos de pesquisa com lixo → vira negativa.
2. **Primeira conversão de Busca**: se registrou, validar o funil ponta-a-ponta (Supabase+GHL+Ads).
3. Leads novos no GHL: cidade/CEP; enriquecer pelo cadastro de Cobb (ano+sqft → squares × $1.043
   = ticket estimado); prioridade ALTA se casa <1996; preencher valor estimado.
4. Pipeline: quem entrou em 0-30d (cadência), quem cruzou 90d (resgate único).
5. Meta: CPL real (action_type=lead), frequência >3 = fadiga de criativo.
6. Anomalias: gasto 2x da média, CPL 2x, zero leads com gasto normal → alertar na hora.

## Checklist semanal
- Placar do playbook (03): fechamentos, decididos, % >90d, mix indicação, bairros 3+ obras,
  % valor preenchido.
- Performance por CEP: Woodstock 30188 vs 30189; Kennesaw 30144/30152.
- Janela 29/07-12/08/2026: reavaliar AI Max / personalização / expansão de URL (mantidos OFF
  por decisão registrada).
- Motivos de perda preenchidos? (47/88 na última auditoria — cobrar.)

## Pendências abertas (herdadas, com dono definido = o dono da empresa decide)
- Conversões de ligação duplicadas no Google Ads (2 ações primárias) — unificar.
- Parceiros de pesquisa ON na campanha — avaliar desligar.
- Recursos faltantes do anúncio: sitelinks, logo, nome da empresa, frases de destaque.
- Rodapé "since 2010" vs anúncio "20+ years" — inconsistência.
- Seção "Repair or replace?" em /lp/marietta-siding — reescrever ou redirecionar.
- Campanha "[SEARCH][FORM][31/03/26] - SERVICES" ativa sem dono claro — auditar gasto.
- Consolidar as 3 páginas de Marietta (canibalização de SERP).
