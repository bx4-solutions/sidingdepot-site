# Evidências de Performance — v5

Data: 10/07/2026 · Site: https://sidingdepotv3.vercel.app

---

## 1. Baseline (PageSpeed Insights — Mobile, antes do v5)

| Categoria | Nota |
|---|---|
| **Desempenho** | **65** ⚠️ |
| Acessibilidade | 96 ✅ |
| Práticas recomendadas | 96 ✅ |
| SEO | 100 ✅ |
| Navegação agêntica | 3/3 ✅ |

**Métricas (mobile, laboratório com throttling pesado do Google):**

| Métrica | Valor | Status |
|---|---|---|
| First Contentful Paint | 3,6 s | ⚠️ |
| **Largest Contentful Paint** | **9,5 s** | ❌ (gargalo principal) |
| Total Blocking Time | 120 ms | ✅ |
| Cumulative Layout Shift | 0,074 | ✅ |
| Speed Index | 3,8 s | ⚠️ |

**Medição no mundo real (conexão normal, não estrangulada):**
- Carregamento total: **~1,9 s**
- Peso transferido: **~537 KB** (abaixo da meta de 1,2 MB)

> Ou seja: para o usuário real o site já está rápido. O "65"/"LCP 9,5 s" vêm do estrangulamento do PageSpeed (simula 4G lento + CPU 4× mais devagar).

**Oportunidades apontadas pelo PSI:**
- Solicitações que bloqueiam a renderização — ~930 ms
- Cache de assets — ~559 KB (curto de propósito, para evitar imagem velha)
- Melhorar entrega de imagens — ~528 KB
- Reduzir JavaScript não usado — ~372 KB
- Reduzir CSS não usado — ~171 KB
- Elementos de imagem sem largura explícita

---

## 2. Correção aplicada no v5 (segura, verificada)

### Preload responsivo do hero (ataca o LCP)
**Problema:** o preload da imagem do hero usava atributos em **minúsculo** (`imagesrcset`, `imagesizes`, `fetchpriority`). O React 19 **descarta** esses atributos (ele emitia o aviso *"Invalid DOM property fetchpriority — did you mean fetchPriority?"*). Resultado: o preload de alta prioridade da imagem principal **não estava valendo** no mobile.

**Correção:** troca para camelCase (`imageSrcSet`, `imageSizes`, `fetchPriority`) nos dois pontos:
- `src/routes/index.tsx` — preload responsivo (srcset) do hero da home.
- `src/routes/__root.tsx` — preloads por media-query (variante desktop 90 KB / mobile 42 KB).

**Efeito esperado:** o navegador passa a **pré-carregar a versão certa do hero com prioridade alta** → o elemento LCP (imagem do hero) aparece antes → LCP menor no mobile.

**Verificação:** todos os arquivos passaram no parser; nenhum atributo minúsculo restante (`grep` limpo).

---

## 3. Próxima iteração (precisa de medição a cada passo)

Sair de 65 → 90+ é um ciclo **mudar → deploy → re-testar no PageSpeed**. Prioridade sugerida:

1. **JS não usado (~372 KB):** dividir/adiar mais chunks da home (ex.: mapa, vídeo) e revisar o chunk principal.
2. **CSS não usado (~171 KB):** revisar a purga do Tailwind (config `content`) para não enviar CSS morto.
3. **Bloqueio de renderização (~930 ms):** avaliar CSS crítico inline.
4. **Cache de assets (~559 KB):** reequilibrar o cabeçalho `Cache-Control` das imagens em `public/` (hoje curto de propósito) — cache mais longo com nome versionado.

> Importante: cada mudança acima precisa ser medida no PageSpeed depois do deploy, pois o efeito real só aparece no ambiente de produção estrangulado.

---

## 4. Histórico rápido de otimização (v4 → v5)

- **v4:** conversão de ~14 imagens para webp + reencode de JPEGs (**~6,9 MB** economizados no site), `loading="lazy"` em 33 componentes abaixo da dobra, e o formulário pesado (zod + react-hook-form) movido para fora do chunk inicial da home.
- **v5:** correção do preload do hero (LCP) + este documento de evidências + script de deploy seguro (`scripts/deploy-vercel.sh`) e `DEPLOY-RUNBOOK.md`.
