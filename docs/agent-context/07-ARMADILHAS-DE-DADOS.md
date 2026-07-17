# 07 — ARMADILHAS DE DADOS (lições pagas caro — LER ANTES DE ANALISAR)

1. **NUNCA somar conversões de Pmax com LSA ou Search.** Pmax conta view de vídeo/Display como
   "conversão"; LSA é ligação real (~$250). Somar INVERTEU o ranking de cidades em 16/07
   (Marietta parecia a pior; era a melhor). Separar por campanha/tipo antes de agregar.
2. **Amostra pequena mente com confiança.** Ticket "médio" $16.494 veio de 12 registros; a base
   inteira deu $25.046. Sempre reportar o n; abaixo de ~30, dizer que é fraco.
3. **O campo `source` automático do GHL subconta o pago** (Google Ads=1 vs 56 no campo declarado
   pelo time). Para canal, usar `where did you hear about`.
4. **44% dos negócios sem valor no GHL** → receita pela planilha do dono, não pelo CRM.
5. **Snippets de busca FABRICAM números** nesta vertical (Acworth "subiu 4,5%" quando caiu 6,3%;
   citações inventadas pegas em flagrante). Zillow devolve cache de 2023 — usar o CSV oficial
   de pesquisa do Zillow, nunca o snippet.
6. **analytics_events (Supabase) não serve para geo**: 61% NULL (ipapi falhou), tráfego próprio
   (Woodstock 1.357 eventos) e cidades do Brasil (o dono navegando). Discriminador teste-vs-real
   = status HTTP em produção, não geo.
7. **Census**: B25036 (dono×década, só Fulton Norte) ≠ B25034 (todas as unidades, Cobb/Cherokee).
   Nunca comparar entre painéis.
8. **Casa velha ≠ demanda.** Holly Springs tinha "CPA ótimo" no dado contaminado e 2 leads reais
   em 2 anos. Estoque é potencial; demanda se prova com lead e fechamento.
9. **Ferramentas**: grep em JSON/HTML de linha única devolve vazio EM SILÊNCIO (trata como
   binário) — usar python. curl 200 não prova renderização (CSP já causou tela branca). APIs do
   GHL exigem User-Agent de navegador. Nunca try/except que engole erro e reporta zero.
10. **Deploy**: só conta bx4usa via script; a outra conta publica no projeto errado sem avisar.
    `--archive=tgz` publica a PASTA, não o commit. `rollback` fixa o alias e exige `promote`.
11. **Meta Ads**: somar apenas action_type=="lead" (leadgen_grouped duplica: CPL $15 falso vs
    $78 real, erro de 16/07).
12. **O MCP "clickone" de deals/contatos está vazio** — o CRM de verdade é o GHL produção.
    A chave GHL do `.env` do site é SANDBOX (Beyond Group), não produção.
13. **Material de fachada não prevê fechamento** (Wood 52% × LP 47% = ruído); prevê ticket.
    Padrão achado em CEP com n<10 é sequência, não taxa.
14. **Casa que fecha, fecha em 12 dias.** Qualquer análise de pipeline que trate um negócio de
    120 dias como "quente" está errada.
