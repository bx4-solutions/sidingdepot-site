# CLAUDE.md — SidingDepot · SITE (sidingdepot.com)

> Projeto governado por AI-GOVERNANCE-BIONE. Site publico de servicos (siding/roofing/etc.) em Georgia/EUA.
> Estas regras tem precedencia. Auditoria: AI-GOVERNANCE-BIONE/docs/audits/sidingdepot-*.md.

## Stack
TanStack Start (rotas file-based em src/routes/) · React 19 · Vite 7 · Supabase · Cloudflare (wrangler) · Playwright · bun.

## Dominio oficial
- **sidingdepot.com** (canonico). `VITE_SITE_ORIGIN` define a origem.
- URLs PROIBIDAS como canonico do site: clickonepro.com ou qualquer dominio de outro projeto.
- Integracao intencional com ecossistema ClickOne (analytics, chat "Bia") e via env/webhook — NAO via copia de codigo.

## Deploy
- **Somente** Vercel project `sidingdepot` (team b7DI5TxFLYn9ScUDezWKxaGm). Build `bun run build`, output `.output/public`.
- PROIBIDO deploy neste repo para o project `sidingdepot-dashboard` ou para o escopo `bionicaosilva-2000s-projects`.
- Nao fazer deploy sem PRE-DEPLOY-CHECKLIST.md verde.

## Rotas
- Validas: ver ROUTE-MAP.md (publicas + admin.* + dev.*). Nova rota segue o padrao file-based do TanStack (src/routes/).
- Proibido: criar rota fora de src/routes/; expor rota /dev.* ou /admin.* sem auth.

## Imports / boundary
- **NUNCA misturar codigo do ClickOne ou do WACRM dentro do SidingDepot.** Integracao externa = via env/webhook/API, nunca import de codigo de outro projeto.
- Antes de criar algo, procure o que ja existe (anti-Frankenstein).

## Integracoes (NAO modificar sem analise)
Supabase (ynvrijkuampxpsmshftm), GoHighLevel (VITE_GHL_WEBHOOK_URL), Google Maps/Places, GA (VITE_GA), Meta Pixel.
`SUPABASE_SERVICE_ROLE_KEY` so no server — nunca expor ao client.

## Fluxo obrigatorio (governanca central)
project-boundary-check -> research-first -> plan -> impact-analysis -> implement-safe (TDD/Playwright) -> review-diff -> test-before-merge -> verification-loop.
Antes de corrigir bug: ler docs/project-memory/errors.md.

## Riscos conhecidos (ver audit)
[HIGH] token embutido no git remote (revogar). [MEDIUM] multiplos escopos Vercel. [MEDIUM] service-role no server.
