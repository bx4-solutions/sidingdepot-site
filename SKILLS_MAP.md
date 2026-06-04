# 🗺️ Mapa de Skills & Automações — Siding Depot

Este projeto foi construído com uma arquitetura focada em **SEO massivo**, **performance extrema** e **rastreamento de conversão em tempo real**. Abaixo estão detalhadas as principais automações e integrações aplicadas.

## 🚀 1. Automação de SEO (Massive Landing Pages)
Para dominar o mercado do Norte da Geórgia, implementamos uma fábrica de conteúdo dinâmica:

- **Matriz de Localização (`src/data/locations.ts`)**: Sistema que cruza 10 cidades com 7 serviços, gerando instantaneamente mais de 70 landing pages otimizadas.
- **Dynamic Routing (TanStack Start)**: Rotas como `/locations/$city/$service` herdam metadados específicos, esquemas de dados e provas sociais locais.
- **Sitemap Generator (`scripts/generate-sitemap.ts`)**: Script que varre a matriz de localização e gera um `sitemap.xml` completo com todas as variações para o Google.
- **JSON-LD Injector (`src/lib/jsonld.ts`)**: Injeção automática de `LocalBusiness`, `Organization`, `Service` e `FAQ` schemas para maximizar o CTR nos resultados de busca.

## 📊 2. Rastreamento e Conversão (Event-Driven)
Nada acontece no site sem ser medido. Criamos um ecossistema de dados robusto:

- **Lead Centralizer (`src/lib/leads.ts`)**: Único ponto de entrada para leads. Envia dados simultaneamente para:
    - **Supabase**: Armazenamento permanente e dashboard interno.
    - **GoHighLevel (GHL)**: Webhook direto para automação de vendas (CRM).
- **Tracking Engine (`src/lib/track.ts`)**: Utilitário que dispara eventos para o `window.dataLayer` (GTM/GA4) e persiste eventos de conversão no Supabase.
- **First-Touch Attribution**: Capturamos e persistimos UTMs (`utm_source`, `utm_medium`, etc.) na sessão para saber exatamente de onde veio o lead, mesmo que ele navegue por várias páginas antes de converter.

## 🛠️ 3. Scripts de Auditoria e Qualidade
Mantemos o site saudável com ferramentas de verificação contínua:

- **SEO Audit Tool (`src/lib/seo-report.ts`)**: Gera relatórios de indexabilidade e metatítulos (veja `seo_audit_report.md`).
- **Scripts de Build (`package.json`)**: Durante o build, o sistema executa auditorias de sitemap e validações de SEO antes de ir para produção.

## 🎨 4. Frontend & Performance
- **Image CDN & Optimization**: Uso de `.asset.json` para garantir que todas as imagens sejam servidas em formatos modernos (WebP) via CDN, com tamanhos controlados para evitar Layout Shift (CLS).
- **Forms Engine (`src/hooks/use-lead-form.ts`)**: Refatoração baseada em `react-hook-form` e `zod` para validação em tempo real e experiência de preenchimento fluida.

---
*Este mapa é atualizado automaticamente conforme novas automações são integradas ao core do projeto.*
