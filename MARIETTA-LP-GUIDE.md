# Guia Técnico: Landing Page de Marietta, GA (/marietta-ga-siding)

Este guia documenta a localização, a arquitetura e as instruções de uso e manutenção da Landing Page de Marietta, GA do site **Siding Depot**.

---

## 1. Localização dos Arquivos no Projeto

* **Arquivo de Rota Principal**: [src/routes/marietta-ga-siding.tsx](file:///Users/severinobione/Desktop/Projeto%20SidingDdept-jun-26%20finalizado/sidingdepot-site/src/routes/marietta-ga-siding.tsx)
  * Rota pública canônica: `/marietta-ga-siding`
* **Mapeamento de Rotas**: [src/routeTree.gen.ts](file:///Users/severinobione/Desktop/Projeto%20SidingDdept-jun-26%20finalizado/sidingdepot-site/src/routeTree.gen.ts) (adicionada automaticamente pelo TanStack Router)
* **Mapa de Rotas Geral**: [ROUTE-MAP.md](file:///Users/severinobione/Desktop/Projeto%20SidingDdept-jun-26%20finalizado/sidingdepot-site/ROUTE-MAP.md)

---

## 2. Estrutura e Recursos da Página

### Layout de Duas Colunas (Hero)
* **Coluna da Esquerda**: Título SEO local, bullets de diferenciais e botões de chamada de ação (ligação e agendamento via popup).
* **Coluna da Direita**: Exibe a imagem em destaque [siding-house-hero-pool.webp](file:///Users/severinobione/Desktop/Projeto%20SidingDdept-jun-26%20finalizado/sidingdepot-site/src/assets/siding-house-hero-pool.webp) (importada via ESM para compilação segura).

### Hyperlocalização de Marietta
Os dados dinâmicos são extraídos de arquivos centrais para consistência de dados:
* **Informações do Site (SITE)** de [src/data/site.ts](file:///Users/severinobione/Desktop/Projeto%20SidingDdept-jun-26%20finalizado/sidingdepot-site/src/data/site.ts) (telefone, e-mail, redes sociais).
* **Configuração da Cidade (CITY)** de [src/data/city-lp-content.ts](file:///Users/severinobione/Desktop/Projeto%20SidingDdept-jun-26%20finalizado/sidingdepot-site/src/data/city-lp-content.ts) (neighborhoods e zips).
* **Avaliações Dinâmicas do Google** de [src/lib/google-stats-context.tsx](file:///Users/severinobione/Desktop/Projeto%20SidingDdept-jun-26%20finalizado/sidingdepot-site/src/lib/google-stats-context.tsx) usando o hook `useGoogleStats()`.

### Comportamento Mobile
* **Centralização Automática**: Elementos de texto, títulos, botões e listas do Hero e outras seções usam as classes utilitárias `text-center lg:text-left`, `mx-auto lg:mx-0` e `justify-center lg:justify-start` para centralizar perfeitamente em celulares, mantendo o alinhamento padrão à esquerda em desktop.
* **Ocultação de Campos no Formulário**: O formulário `HeroQuoteForm` recebeu a classe `hidden sm:block` nos blocos de *"Serviços"* e *"Detalhes do Projeto"*, exibindo apenas os campos básicos (**Nome**, **Telefone**, **E-mail** e **Consentimento**) no mobile para evitar atrito com o usuário.

### Injeção de MetaTags & Schemas JSON-LD
A rota define metadados avançados de SEO e schemas estruturados na propriedade `head` da rota:
* **LocalBusiness**: Schema local contendo a latitude, longitude e cidades atendidas.
* **FAQPage**: Acordeão mapeando as perguntas frequentes.
* **Service**: Mapeamento do serviço de revestimento James Hardie e catálogo de ofertas.

---

## 3. Instruções para Manutenção e Edição

### Como Testar Localmente
1. Certifique-se de que a porta `8080` está livre na sua máquina.
2. Inicie o servidor local no terminal do projeto:
   ```bash
   bun run dev
   ```
   *(ou `npm run dev`)*
3. Acesse a URL: [http://localhost:8080/marietta-ga-siding](http://localhost:8080/marietta-ga-siding)

### Regras para Edição (para Agentes de IA / Desenvolvedores)
1. **Evitar loops de array vazios**: Ao renderizar elementos estáticos repetidos (como as 5 estrelas das reviews), use sempre `Array.from({ length: 5 })` em vez de `[...Array(5)]`. O compilador SSR do TanStack Start e o transpiler do Vite podem quebrar na renderização do lado do servidor se a desestruturação de slots vazios for utilizada.
2. **Caminhos de Assets**: Sempre use aliases absolutos (como `@/assets/...`) para importação de imagens estáticas que necessitam de compilação ou compressão pelo bundler, garantindo que o SSR localize o recurso.
3. **Formulários**: Toda chamada ao `HeroQuoteForm` deve repassar as propriedades `source` e `tag` correspondentes à rota para segmentação e rastreamento correto de leads no CRM (ex: `source="marietta_ga_siding_page"`).
