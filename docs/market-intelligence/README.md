# Base de Conhecimento de Mercado (`market_intel`)

Base de conhecimento que os agentes de AI da Siding Depot leem para **preparar ofertas**
e **alocar marketing com assertividade**, aprendendo a cada novo fechamento.

Construída em 2026-07-17 a partir de **800 negócios reais do GHL de produção** +
**cadastro imobiliário de Cobb County** (244.827 lotes).

## O que tem aqui

| Arquivo | O que é |
|---|---|
| `KNOWLEDGE-PACK.md` | **O digest que os agentes carregam como contexto.** Regras de negócio, fórmula de preço, fechamento por cidade, concorrentes, os 15 maiores bairros. Legível e auto-contido. |
| `data/*.json` | Cópia versionada dos 6 datasets (neighborhoods, city_performance, price_by_size, competitor_coverage, channel_mix, siding_material). |
| `seed.sql` | Carga inicial idempotente do schema Supabase. Também é o que o refresh diário reexecuta. |
| `refresh.py` | O job de atualização diária: repuxa GHL + cadastre, recalcula tudo, regenera seed + JSONs + pack. |
| `../../supabase/migrations/20260717120000_market_intel_knowledge_base.sql` | DDL do schema `market_intel` (7 tabelas + view `agent_brief`). |

## Arquitetura

```
GHL (fechamentos)  ─┐
                    ├─► refresh.py (diário, madrugada) ─► seed.sql ─► Supabase market_intel
Cobb cadastre ──────┘                                 └─► data/*.json + KNOWLEDGE-PACK.md (repo)

Agentes de AI leem:  Supabase (fonte viva, via MCP/SQL)  OU  KNOWLEDGE-PACK.md (contexto)
```

- **Fonte da verdade:** schema `market_intel` no Supabase de produção.
- **Cópia legível:** este diretório, versionado no git.
- **A view `market_intel.agent_brief`** é o read pronto: bairros ranqueados por oportunidade (casas-alvo não tocadas × ticket estimado), com selo `untapped` / `lightly-touched` / `active`.

## Como ATIVAR a metade Supabase (precisa de você — 1 passo)

O schema e o seed estão prontos, mas eu **não tenho credencial de escrita** no Supabase de
produção (só a service-role para leitura via REST; a senha do DB e o token de gestão são seus).
Numa sessão interativa, com acesso ao DB, colar os dois arquivos no SQL Editor do painel Supabase:

1. `supabase/migrations/20260717120000_market_intel_knowledge_base.sql` (cria o schema)
2. `docs/market-intelligence/seed.sql` (carrega os dados)

## Como ligar a ATUALIZAÇÃO DIÁRIA

O plano Vercel Hobby está no limite de crons, então o refresh **não roda na Vercel**.
Duas opções, em ordem de preferência:

1. **pg_cron dentro do Supabase** (recomendado): um job SQL que chama uma Edge Function
   `market-intel-refresh` toda madrugada. A função repuxa GHL + cadastre e reexecuta o seed.
   Precisa: deploy da edge function + a **GHL API key de produção** como secret do Supabase.
2. **Cron externo** (GitHub Actions, cron do Mac) rodando `refresh.py` e aplicando o seed.

**Bloqueador conhecido:** `refresh.py` precisa da **GHL API key de produção** (a do `.env`
é a sandbox). Sem ela, o repuxo de fechamentos novos não roda. Fornecer essa chave é o que
falta para o "aprende todo dia" funcionar sozinho.

## Regras que os agentes herdam (ver KNOWLEDGE-PACK.md)

- A empresa **não faz reparo** de siding — nunca ofertar.
- Alvo = casa **anterior a 1996**; não mirar quem já tem fiber cement.
- Preço = `squares × $1.043`; ticket mediano por casa = **$22.982**.
- Investir onde **fecha** (Kennesaw/Roswell 77%), não onde só há volume.
- **57% do negócio é orgânico** (vizinho, drive-by, indicação) — densidade vale mais que alcance.

## Limites honestos (não inventar em cima)

- Material da fachada por bairro não existe em dado público de Cobb/Fulton — usar o **ano** como proxy.
- 46% dos endereços do CRM casaram com Cobb; a penetração por bairro cobre menos da metade da base.
- 44% dos negócios no GHL estão sem valor — corrigir isso melhora todo cálculo de ticket.
- Fechamento por cidade só é confiável com 8+ decididos (o pack já filtra).
