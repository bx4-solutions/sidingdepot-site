# 02 — MERCADO E TERRITÓRIO (metro Atlanta / Cobb)

## Ranking de cidades (2 fontes independentes concordam: LSA + CRM)
| Cidade | Leads reais LSA (2 anos) | Custo/lead | Fechamento CRM | Ticket | Veredito |
|---|---|---|---|---|---|
| Marietta | 77 (48% de tudo) | $166 | 63% (270 neg.) | $24.768 | BASE — campanha no ar |
| Kennesaw | 15 | $251 | **77%** | $21.003 | PRÓXIMA cidade |
| Roswell | 12 | $293 | **74-77%** | $24.781 | em seguida (17.833 casas-alvo, 24 min) |
| Woodstock | 13 | $277 | 43% | **$43.517** | contraditória — ticket alto, fecha mal |
| Acworth | 7 | $329 | 70% | $23.053 | fila (Dr. Roof não vende siding lá) |
| Alpharetta | 7 | $320 | 67% | $29.232 | fila |
| Johns Creek | 6 | $314 | **0% (0W/5L)** | — | FORA — nunca fechou |
| Sandy Springs | 0 | — | — | — | FORA — zero demanda |
| Canton / Holly Springs | 0 / 2 | — | — | — | FORA — estoque pós-2000 |
| Smyrna | 2 | $327 | 33% | $19.250 | TESTAR (11 min, 9.831 casas 80-89) |

Regra de ouro: **quanto mais perto da sede, mais barato e volumoso o lead** ($166 Marietta
→ $320 Alpharetta). Expandir por anel, não por salto.

## Bairros de Cobb (cadastro do condado, lote a lote — 17/07/2026)
- **63.225 casas de 1980-1995** em **827 bairros** (20+ casas). Mercado = $22,2 bi em valor de casas.
- Penetração da empresa: **0,31%** das casas-alvo; 691 bairros com ZERO venda; melhor bairro = 1,17%.
- Top bairros VIRGENS por potencial: **Brookstone PD 1** (555 casas, 1991, $475k, pot. 3% = $606k),
  Sibley Forest (292, $677k), Hampton Woods (229, $616k), Waterford Green (144, $898k),
  Milford Chase (409), Walkers Ridge (309), Brookstone II (381), Vinings Glen (186), Jefferson Township (225).
- Onde JÁ vende: CEPs **30062 + 30066 = 40% dos negócios localizados** (casa 1980-85, cedro).
- CEP 30188 (Woodstock): ticket $50.315, fecha 56% · vizinho 30189: $9.525, fecha 20% — investigar.
- Dataset completo: `neighborhoods.json` (60 maiores) / Supabase `market_intel` (827).

## Estoque por cidade (Census ACS 2024)
ATENÇÃO: duas tabelas DIFERENTES — não comparar entre si: Fulton Norte = dono×década (B25036);
Cobb/Cherokee = todas as unidades (B25034).
Fulton Norte (dono, 1980-2009): Johns Creek 20.133 · Roswell 17.833 · Alpharetta 13.151 ·
Sandy Springs 13.076 (só 50% na janela) · Milton 7.891 (2000s — errada p/ troca).
Cobb (unidades 1980-99): Smyrna 9.831 · Mableton 9.686 · Kennesaw 6.330 · Acworth 3.379 ·
Powder Springs 3.034. Cherokee é jovem demais (Woodstock 27% pré-2000, Holly Springs 21%).

## Fontes de dados de território (sem credencial)
- Cadastro Cobb (aberto): `https://gis.cobbcounty.gov/gisserver/rest/services/tax/taxassessorsdaily/MapServer`
  · layer 0 CobbParcels (PIN, SUBDIVNUM, FMV_BLDG, SITUS_ADDR, CLASS='R3') · layer 5 YearBuilt
  (PIN, YRBLT, SQFT, TAXYR) · layer 3 Subdivisions (SUBDIVNUM→SUBDIVNAME). Paginar 1000/req.
- Material de fachada NÃO existe público em Cobb/Fulton. Cherokee tem (Spatialest) mas proíbe
  API — pedir extração CAMA ao Chief Appraiser de Cherokee (678-493-6120).
- Enriquecimento de lead: endereço → cadastro → YRBLT+SQFT → squares ≈ SQFT/100×1,1 →
  ticket = squares × $1.043 → prioridade ALTA se ano<1996. (Provado com leads reais em 17/07.)
