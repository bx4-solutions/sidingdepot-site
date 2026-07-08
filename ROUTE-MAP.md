# ROUTE MAP — SidingDepot · SITE (TanStack file-based, src/routes/)

## Publicas
index, about, contact, finance, gallery, guide(+guide.thank-you), siding, roofing, painting, decks, doors, windows,
dumpster, dumpster-rental, services.$slug, projects(.index/$slug), blog(.index/$slug), locations.$city.$service,
lp.siding-marietta, lp.siding-alpharetta, lp.siding-canton, sitemap.xml, blog-sitemap.xml,
privacy-policy, terms-of-use.

## Admin (auth obrigatoria)
admin.login, admin.dashboard, admin.users, admin.analytics, admin.blog(.$slug), admin.blog-preview,
admin.reset-password, reset-password, access-denied, seo-dashboard.
Todas com `beforeLoad` de auth exceto admin.login/admin.reset-password (precisam ficar acessiveis
a usuario deslogado).

## Dev (protegidas por beforeLoad; nao expor sem protecao)
dev.design-preview, dev.hotspot-calibrator.

## Regras
- Nova rota = novo arquivo em src/routes/ (padrao TanStack). Atualize este mapa.
- Rotas admin.* e dev.* exigem auth/gating. Nao criar rota que vaze dados sem auth.
