Este plano detalha as etapas para consolidar e elevar o SEO do site Siding Depot, focando em SEO técnico, local, de conteúdo e monitoramento de performance.

### 1. SEO Técnico e Infraestrutura
*   **Consolidação de Sitemaps:** Eliminar arquivos estáticos (`public/sitemap.xml`, `public/blog-sitemap.xml`) em favor de sitemaps dinâmicos que incluam automaticamente novas páginas de serviços, posts do blog e combinações regionais.
*   **Otimização do robots.txt:** Atualizar o arquivo para apontar corretamente para os sitemaps dinâmicos e garantir que rotas administrativas (`/admin`, `/seo-dashboard`) permaneçam privadas.
*   **Schema Markup Avançado:** 
    *   Implementar `BreadcrumbList` em todas as páginas para melhorar a navegação e o entendimento estrutural pelo Google.
    *   Expandir o `Review` schema em páginas de localização para destacar avaliações locais.
*   **Monitoramento de Performance:** Configurar auditorias automáticas via Lighthouse para manter pontuações de Core Web Vitals (LCP, FID, CLS) otimizadas.

### 2. SEO Local (Geo-Targeting)
*   **Expansão de Landing Pages Regionais:** Automatizar a criação de páginas para cidades adicionais no Norte da Geórgia (Cobb, Cherokee, Fulton, Forsyth).
*   **Sinais Locais:** Integrar dados do Google Business Profile (links de avaliações reais, mapas dinâmicos) em cada página de localização para fortalecer a relevância geográfica.
*   **NAP Consistency:** Garantir que o Nome, Endereço e Telefone (NAP) estejam idênticos em todas as instâncias estruturadas (JSON-LD) e visuais.

### 3. Estratégia de Conteúdo e Autoridade
*   **Otimização do Blog:** Criar um calendário editorial focado em "Palavras-chave de Cauda Longa" (ex: "custo de siding James Hardie em Marietta GA 2026") para capturar tráfego de alta intenção.
*   **E.E.A.T (Experiência, Especialidade, Autoridade, Confiança):** Reforçar as páginas de projetos com descrições ricas, localizações específicas e selos de certificação (Elite Preferred).
*   **Linkagem Interna:** Implementar uma estrutura de links entre Blog -> Serviços -> Localizações para distribuir a autoridade da página (Link Equity).

### 4. Monitoramento e Testes A/B
*   **SEO Dashboard:** Utilizar o painel existente para rastrear taxas de conversão por página e origem de tráfego.
*   **Testes A/B de Metatags:** Utilizar a infraestrutura já criada em `src/data/seo-config.ts` para testar diferentes títulos e descrições, otimizando a taxa de clique (CTR) nos resultados de busca.

---

### Detalhes Técnicos para Implementação

**Arquivos Principais:**
*   `src/routes/sitemap[.]xml.tsx`: Centralizar a lógica de sitemap dinâmico aqui.
*   `src/lib/schema.ts`: Criar utilitários para Breadcrumbs e Reviews.
*   `src/data/locations.ts`: Gerenciar a lista de cidades e serviços para geração automática de páginas.
*   `src/data/seo-config.ts`: Configurar variantes de metadados para testes A/B.

**Próximos Passos Imediatos:**
1.  Remover os arquivos XML estáticos da pasta `public`.
2.  Atualizar o `robots.txt` para referenciar apenas o sitemap dinâmico.
3.  Implementar o Schema de Breadcrumbs globalmente no `src/routes/__root.tsx`.
4.  Realizar uma auditoria de H-tags (H1, H2) em todas as rotas de serviço.
