# Pre-Deploy Checklist — SidingDepot · SITE

Rode ANTES de deploy. Inclui o checklist obrigatorio de integridade (FASE 5).

## URL / Integridade (obrigatorio)
- [ ] 1. Dominio validado: canonico = sidingdepot.com (VITE_SITE_ORIGIN correto)
- [ ] 2. Vercel project validado: `sidingdepot` (team b7DI5) — NAO o dashboard, NAO outro escopo
- [ ] 3. Entry/router validado: src/router + src/routes/ batem com ROUTE-MAP.md
- [ ] 4. Rotas validadas: nenhuma rota nova fora do padrao; admin.*/dev.* protegidas
- [ ] 5. Imports validados: nenhum import de codigo ClickOne/WACRM
- [ ] 6. Procurar codigo ClickOne: grep clickone/clickonepro/Bia — so integracao via env/webhook, nunca codigo copiado
- [ ] 7. Procurar codigo WACRM: grep wacrm — deve dar zero

## Qualidade
- [ ] bun run build OK · typecheck OK · testes (Playwright) OK
- [ ] funciona no preview (verification-loop)

## Seguranca
- [ ] sem segredo/.env no diff; SUPABASE_SERVICE_ROLE_KEY so server
- [ ] entrada validada nos endpoints do server/

## Registro
- [ ] errors.md atualizado se algo deu errado
