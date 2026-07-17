# PACOTE DE CONTEXTO — Siding Depot (para Claude e GPT)

Gerado em 2026-07-17 a partir de: 800 negócios do GHL (números auditados 9/9 contra as fontes),
cadastro de Cobb County (244.827 lotes), Google Ads/LSA (2 anos), Census ACS 2024, mapa de LPs
de concorrentes, e as configurações reais feitas em julho/2026 (campanha, GTM, GHL, Supabase).

## Como montar o projeto
**Claude (claude.ai → Projects):** cole `00-INSTRUCOES-DO-AGENTE.md` no campo "Instructions";
suba os arquivos 01-07 em "Project knowledge". Opcional: suba também os JSONs de
`../market-intelligence/data/` (datasets completos — os .md trazem os resumos).
**GPT (chatgpt.com → Create a GPT):** cole o `00` em "Instructions"; suba 01-07 + JSONs em
"Knowledge"; ative "Code Interpreter" para o GPT conseguir ler os JSONs.

## Regras do pacote
- **ZERO credenciais aqui** (só IDs). Chaves ficam nos arquivos locais/envs citados no 06.
  Nunca adicione uma chave a este pacote — ele sobe para plataformas externas.
- Fonte da verdade dinâmica = Supabase `market_intel` (quando carregado) + refresh diário.
  Este pacote é o retrato de 17/07/2026 — as datas estão marcadas nos arquivos.
- Para atualizar: rode `docs/market-intelligence/refresh.py` e regenere os .md (processo no
  README de market-intelligence). Novas conquistas/fechamentos entram pelo refresh diário.

## Conteúdo
00 instruções do agente (system prompt) · 01 empresa e regras de negócio · 02 mercado e
território · 03 preços, fechamento e pipeline · 04 canais, campanhas e concorrentes ·
05 plataformas, IDs e integrações · 06 rotinas e tarefas diárias · 07 armadilhas de dados.
