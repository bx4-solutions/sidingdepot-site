# Base de Conhecimento de Mercado — Siding Depot

> Documento que os agentes de AI leem para **preparar ofertas** e **alocar marketing**.
> Fonte: 800 negocios do GHL de producao + cadastro imobiliario de Cobb (244.827 lotes).
> Gerado 2026-07-17. Atualizacao diaria automatica (ver 'Como isto se atualiza').

## Regras de negocio que o agente NUNCA pode violar
- **A empresa NAO faz reparo de siding.** So troca completa e instalacao nova. Nunca ofertar reparo.
- **O alvo e casa anterior a 1996.** 87% dos clientes reais tem casa <1996; o pico e 1980-1995 (72%).
- **Nao mirar quem ja tem fiber cement** — ticket cai a metade ($14,974).

## Numeros-ancora (para calcular qualquer oferta)
- **Preco por square: $1,043** (1 square = 100 pes2 de parede). Base de todo orcamento.
- **Ticket mediano de uma casa fechada: $22,982.**
- **Taxa de fechamento geral: 61%** (132 ganhas x 84 perdidas nas decididas).
- Mercado-alvo em Cobb: **63,225 casas** de 1980-95 em **827 bairros**.

## Como precificar uma oferta (formula)
```
ticket_estimado = squares_da_casa x $1043
  onde squares ~= (pes2_construidos / 100) x 1.1   [fator de parede]
```
Economia de escala real — o $/square CAI com o tamanho da casa:

| Tamanho (squares) | Ticket mediano | $/square | n |
|---|---|---|---|
| 1-10 | $6,120 | $1,101 | 23 |
| 11-20 | $15,675 | $1,052 | 31 |
| 21-30 | $26,966 | $1,013 | 30 |
| 30+ | $36,000 | $948 | 33 |

## Onde investir marketing — fechamento e ticket por cidade
Ordenado por taxa de fechamento. **So cidades com 8+ negocios decididos** (amostra confiavel).

| Cidade | Negocios | Fechamento | Ticket medio |
|---|---|---|---|
| Roswell | 49 | 77% | $24,781 |
| Kennesaw | 37 | 77% | $21,003 |
| Acworth | 32 | 70% | $23,053 |
| Atlanta | 45 | 69% | $13,811 |
| Alpharetta | 29 | 67% | $29,232 |
| Marietta | 270 | 63% | $24,768 |
| Woodstock | 40 | 43% | $43,517 |

**Leitura:** Roswell (77%) e Kennesaw (77%) fecham melhor que a sede Marietta (63%). Alpharetta tem o maior ticket ($29k). Woodstock fecha mal (43%) mas ticket alto ($43k). Johns Creek fechou 0 de 5 — nao priorizar.

> **Cuidado com amostra pequena:** Decatur (100%, so 2 decididos), Douglasville (100%, so 1 decididos), Canton (100%, so 1 decididos), Dallas (100%, so 1 decididos), Mableton (100%, so 1 decididos), Powder Springs (50%, so 4 decididos) — nao ranquear por essas. 100% de 2 negocios nao e taxa, e coincidencia.

## De onde vem os clientes (alocacao de canal)
57% do negocio NAO vem de midia paga. A obra vende a proxima obra — densidade > alcance.

| Canal | Negocios |
|---|---|
| Neighborhood | 79 |
| Referral | 78 |
| Drive By | 72 |
| Google ADS | 56 |
| Returning Customer | 49 |
| Wrapped Vehicles | 43 |
| Website | 39 |
| Re-Quote | 23 |
| Facebook | 23 |
| James Hardie | 19 |
| Thumbtack | 16 |
| Best Pick Reports | 14 |

## Concorrentes — quem oferece o que, por cidade
- **EXOVATIONS**: 10 cidades. Servicos: decks, porches, replacement-windows, roofing, siding.
- **Dr. Roof**: 10 cidades. Servicos: roofing, siding, storm-damage, window-replacement.

**Posicionamento:** EXOVATIONS e o rival direto (siding + decks + porches + janelas + roofing nas 10 cidades). Dr. Roof e roofing-first e domina o cluster de seguro/tempestade (storm-damage) que a Siding Depot nao cobre. Siding Depot e siding-only — a vantagem e foco e a sede local.

## Faturamento: atual vs potencial
- **Atual (historico no CRM):** ~$3,4M (147 casas fechadas x $22,982).
- **Potencial enderecavel em Cobb:** 63.225 casas x 3% x ~$22k = **$42M**. A 1% = $14M; a 5% = $70M.
- **Penetracao atual: 0,31%** das casas-alvo do condado. 691 dos 827 bairros nunca receberam uma venda.

## Os 15 maiores bairros de Cobb (alvo primario)
| Bairro | Casas 80-95 | Pes2 tipico | Ticket estimado | Potencial 3% |
|---|---|---|---|---|
| O.C.HUBERT | 592 | 2144 | $24,588 | $436,683 |
| BROOKSTONE PD 1 | 555 | 3175 | $36,411 | $606,243 |
| HIGHLAND POINTE | 432 | 3002 | $34,427 | $446,174 |
| CHESTNUT HILL | 429 | 2983 | $34,209 | $440,270 |
| COUNTRY WALK | 423 | 1724 | $19,771 | $250,894 |
| MILFORD CHASE | 409 | 2155 | $24,714 | $303,241 |
| WINDSOR OAKS (WAS WINDSOR PARISH) | 400 | 3023 | $34,668 | $416,016 |
| LEES CROSSING | 388 | 2564 | $29,404 | $342,263 |
| BROOKSTONE II | 381 | 2712 | $31,101 | $355,484 |
| OWENS MEADOW | 367 | 1460 | $16,743 | $184,340 |
| CHIMNEY LAKES | 347 | 2765 | $31,709 | $330,091 |
| WALKERS RIDGE | 309 | 2552 | $29,267 | $271,305 |
| HIGHLAND RIDGE ESTATES | 307 | 2560 | $29,358 | $270,387 |
| SIBLEY FOREST | 292 | 3456 | $39,634 | $347,194 |
| WESTCHESTER (WAS HEATHERSTONE) | 288 | 2496 | $28,624 | $247,311 |

*(Lista completa dos 827 bairros em `data/neighborhoods.json` e na view `market_intel.agent_brief`.)*

## Como isto se atualiza
- **Fonte da verdade:** schema `market_intel` no Supabase de producao (migration `20260717120000`).
- **Atualizacao diaria:** job recalcula de madrugada dos fechamentos novos do GHL + cadastre. Roda DENTRO do Supabase (pg_cron), nao na Vercel (plano Hobby no limite de crons).
- **Este arquivo** e o digest legivel; os JSONs em `data/` sao a copia versionada; o Supabase e a fonte viva.

## O que este conhecimento AINDA nao tem (nao inventar)
- Material da fachada por bairro em Cobb/Fulton: nao existe em dado publico. Usar o ANO da casa como proxy.
- Custo de lead na Busca: a campanha de Marietta e a primeira; sem historico ainda.
- So 46% dos enderecos do CRM casaram com Cobb — penetracao por bairro cobre menos da metade da base.
- 44% dos negocios no GHL estao sem valor preenchido — corrigir isso melhora todo calculo de ticket.