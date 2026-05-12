## 1. Service Strip dedicado abaixo da navbar (`ServiceStrip.tsx`)

Novo componente `src/components/site/ServiceStrip.tsx` montado no `__root.tsx` logo abaixo do `<Navbar />`, antes do `<main>`. Modelado pelo Dr. Roof: três títulos grandes em uma linha, divididos por separadores verticais, sobre fundo claro contrastando com a navbar escura.

- Fundo: `bg-sd-gray-bg` (claro, contrastando com a navbar `sd-navy`)
- Tipografia: `font-display` (Bebas Neue) tamanho `text-2xl sm:text-3xl`, cor `text-sd-navy`, hover `text-sd-green`
- Espaçamento: container `max-w-7xl px-4 lg:px-8 py-4 sm:py-5`, gap entre itens com separadores verticais `border-l border-sd-gray-border`
- Cada item é um `<Link>` clicável (não mais texto plano)
- Mobile: empilha em 3 linhas com separadores horizontais
- Borda inferior `border-b border-sd-gray-border` para fechar o bloco

## 2. Links clicáveis para cada serviço

Cada um dos três (Siding, Painting, Windows) vira um `<Link to="/" hash="services-{slug}">` que rola até o card correspondente na seção "Our Services" da home. Aproveita `scroll-behavior: smooth` já configurado no `styles.css`.

- Adicionar `id="services"` no `<section>` "Our Services" e `id="services-siding"`, `id="services-painting"`, `id="services-windows"` em cada `ServiceCard` correspondente (via prop `id` opcional no `ServiceCard`).
- Cada Link no ServiceStrip dispara `track("service_strip_click", { service })`.
- A tagline duplicada que existe agora **abaixo do logo** na Navbar é removida (substituída pela nova faixa).

> Observação: como não existem rotas dedicadas `/siding`, `/painting`, `/windows` ainda, o padrão por enquanto é scroll-to-section. Quando essas páginas forem criadas, basta trocar `to="/"` + `hash` por `to="/siding"` etc.

## 3. Padronização ao Design System

Limpar usos ad-hoc nos elementos recém-criados:

- **Navbar logo block**: remover a sub-tagline inline (movida para o ServiceStrip), manter apenas `h-11 sm:h-12 w-auto`. Voltar `h-20` para `h-16` (espaçamento padrão pré-existente, evita header gigante).
- **CTA card abaixo do slider** (`PainPointsSection`): trocar `bg-sd-black` por `bg-sd-navy` (token de seção escura usado em todo o site), `rounded-xl` mantido, padding já segue escala (`p-4 sm:p-5`), `gap-3 sm:gap-4` mantido.
- **QuoteModal**: usar `text-destructive` em vez de `text-red-600` (token semântico shadcn).
- **Slider labels**: já usam `bg-sd-black/75` e `bg-sd-green` — conferem com o sistema.

Nenhuma alteração de palette, fonte ou raio (`rounded-pill` / `rounded-xl`) — apenas troca de cores hard-coded por tokens.

## 4. Tracking adicional

No `src/components/site/QuoteModal.tsx`:

- `quote_form_validation_error` — disparado em `handleSubmit` quando `schema.safeParse` falha. Payload: `{ source, fields: "name,phone" }` (lista dos campos com erro).
- `quote_modal_close` — disparado em `handleOpenChange(false)` **somente quando `done === false`** (fechamento sem envio). Payload: `{ source, had_input: boolean }` indicando se o usuário digitou algo.

No novo `ServiceStrip`:

- `service_strip_click` — disparado no clique de cada link com `{ service }`.

## Arquivos afetados

- **Criar**: `src/components/site/ServiceStrip.tsx`
- **Editar**: `src/routes/__root.tsx` (montar ServiceStrip), `src/components/site/Navbar.tsx` (remover tagline duplicada, voltar `h-16`), `src/routes/index.tsx` (adicionar `id="services"` + ids por serviço), `src/components/site/ServiceCard.tsx` (aceitar prop `id` opcional), `src/components/site/PainPointsSection.tsx` (trocar `bg-sd-black` → `bg-sd-navy`), `src/components/site/QuoteModal.tsx` (tracking + tokens)