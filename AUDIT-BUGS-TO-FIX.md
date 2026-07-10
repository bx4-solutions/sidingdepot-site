# Siding Depot — Auditoria de Bugs (sidingdepot-site)

> Gerado em 2026-07-08 a partir de inspeção direta do código local (`sidingdepot-site/`) + teste ao vivo de `https://sidingdepotv3.vercel.app/` + `git status`/`git diff`.
> Objetivo: lista de tickets prontos para um agente de código (Claude/Antigravity/Lovable) executar, um por um. Cada item tem arquivo exato, linha, problema, correção e critério de "pronto".

---

## P0 — Crítico (bloqueia qualquer go-live ou tráfego pago real)

### 1. Painel admin exposto publicamente no rodapé, sem condição
- **Arquivo:** `src/components/site/Footer.tsx`, linhas 174–187
- **Problema:** o link `https://sidingdepot-dashboard.vercel.app/admin/dashboard` é renderizado para QUALQUER visitante do site. O componente já busca `session` via `supabase.auth.getSession()` (linhas 60–75) mas nunca usa essa variável para condicionar o link — é uma checagem morta, nunca aplicada.
- **Correção:** remover o link "Painel" do rodapé público (recomendado) ou, no mínimo, envolver em `{session && (...)}`. O painel (`sidingdepot-dashboard`) precisa ter seu próprio login — não pode depender só de "não estar linkado" para ficar protegido.
- **Pronto quando:** o HTML do rodapé para visitante deslogado não contém nenhuma referência à URL do dashboard admin.

### 2. Rota `/admin/dashboard` sem nenhuma proteção de autenticação
- **Arquivo:** `src/routes/admin.dashboard.tsx`
- **Problema:** não existe `beforeLoad` de auth (diferente de `admin.analytics.tsx`, que faz corretamente `if (!session) throw redirect({ to: "/admin/login" })` na linha 77). Qualquer pessoa que acesse a URL diretamente vê o dashboard completo sem logar.
- **Correção:** copiar o padrão `beforeLoad` de `admin.analytics.tsx` para `admin.dashboard.tsx`.
- **Pronto quando:** acessar `/admin/dashboard` deslogado redireciona para `/admin/login`.

### 3. Rota `/admin/users` só tem checagem fraca no client
- **Arquivo:** `src/routes/admin.users.tsx`, linhas ~24–27
- **Problema:** a checagem roda dentro de `useEffect`, depois que o componente já montou/renderizou — o conteúdo pisca antes do redirect, e não é proteção em nível de rota (router-level).
- **Correção:** trocar por `beforeLoad` igual ao de `admin.analytics.tsx`.
- **Pronto quando:** mesmo critério do item 2.

### 4. Rotas `dev.*` sem nenhuma proteção
- **Arquivos:** `src/routes/dev.design-preview.tsx`, `src/routes/dev.hotspot-calibrator.tsx`
- **Problema:** o próprio `ROUTE-MAP.md` do projeto já diz que essas rotas "NAO expor em producao sem protecao" — mas nenhuma tem `beforeLoad`.
- **Correção:** adicionar `beforeLoad` de auth, OU excluir do build de produção, OU no mínimo adicionar `Disallow: /dev/` no `public/robots.txt` (hoje só tem `/admin/`, `/seo-dashboard/`, `/access-denied/`).
- **Pronto quando:** guard presente + robots.txt atualizado.

### 5. Privacy Policy e Terms of Use existem localmente mas NÃO estão publicados
- **Arquivos:** `src/routes/privacy-policy.tsx`, `src/routes/terms-of-use.tsx` — aparecem como `??` (untracked) no `git status`. As mudanças em `Footer.tsx` que linkam para eles também estão sem commit.
- **Problema:** o site ao vivo (`sidingdepotv3.vercel.app` e, no futuro, `sidingdepot.com`) hoje NÃO tem páginas de privacidade/termos — exigência do Google Ads para qualquer site com formulário de lead + captura de telefone, além de proteção jurídica básica.
- **Correção:** `git add` + commit + push + redeploy desses 3 arquivos.
- **Pronto quando:** `git status` limpo nesses arquivos, e `https://sidingdepot.com/privacy-policy` e `/terms-of-use` respondem em produção.

---

## P1 — Alto (corrigir antes de apontar Google Ads para este site)

### 6. Política de Privacidade está em português; o resto do site é em inglês
- **Arquivo:** `src/routes/privacy-policy.tsx` (linha 24: "Política de Privacidade — Siding Depot", conteúdo todo em PT)
- **Problema:** o mercado-alvo é Georgia/EUA, inglês. Todas as outras páginas são em inglês. Uma página legal em outro idioma passa falta de profissionalismo e pode confundir revisores de política do Google Ads.
- **Correção:** traduzir `privacy-policy.tsx` para inglês. Conferir também o corpo completo de `terms-of-use.tsx` (só o título foi checado, confirmar se o corpo também está 100% em inglês).
- **Pronto quando:** as duas páginas legais 100% em inglês, consistentes com o resto do site.

### 7. Arquivo `.env` versionado no git
- **Arquivo:** `.env` (confirmado via `git ls-files`)
- **Conteúdo:** `SUPABASE_PROJECT_ID`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` (+ duplicatas com prefixo `VITE_`). São chaves anon/publishable do Supabase — seguras por design para expor no client, DESDE QUE as políticas de Row Level Security (RLS) estejam corretas em todas as tabelas. Ainda assim, versionar `.env` é má prática (deveria existir só como variável de ambiente na Vercel + um `.env.example` vazio no repo).
- **Correção:** `git rm --cached .env` (o `.gitignore` já tem `.env*`, então isso resolve). Rodar `get_advisors` do Supabase para confirmar que nenhuma tabela está sem RLS.
- **Pronto quando:** `.env` não aparece mais em `git ls-files`; advisors do Supabase sem alertas de RLS ausente.

---

## P2 — Médio / consistência

### 8. Destino de redirect pós-login não bate com o ROUTE-MAP
- **Arquivo:** `src/routes/admin.login.tsx` (linha ~29: `navigate({ to: "/seo-dashboard" })`)
- **Problema:** o `ROUTE-MAP.md` classifica `/seo-dashboard` como rota "Dev/SEO — NAO expor em producao sem protecao", não como destino de login do admin. Login deveria mandar para `/admin/dashboard` (depois de corrigido o item 2) — a menos que `/seo-dashboard` seja mesmo o console principal pretendido.
- **Correção:** alinhar o destino do redirect com a intenção real; atualizar `ROUTE-MAP.md` se `/seo-dashboard` for de fato o console principal.

### 9. Confirmar checklist de pré-deploy antes de tratar este site como definitivo
- A tag `canonical` já aponta corretamente para `https://sidingdepot.com` (confirmado ao vivo em `sidingdepotv3.vercel.app`) — bom sinal, mostra que o V3 foi feito para substituir o site atual. Mas o item 1 do `PRE-DEPLOY-CHECKLIST.md` ("Dominio validado: canonico = sidingdepot.com") ainda está desmarcado — rodar o checklist completo que já existe no repo antes de apontar o domínio real ou qualquer tráfego pago para cá.

---

## Confirmado correto (não mexer)
- NAP no código está certo e consistente: `3036 Roswell Rd, Marietta, GA 30062` / `(678) 400-2012` (`src/data/site.ts`) — bate com o endereço já confirmado.
- GTM (`GTM-TFGQWCQN`) e GA4 instalados corretamente, conforme `seo_audit_report.md`.
- `robots.txt` já bloqueia `/admin/`, `/seo-dashboard/`, `/access-denied/` corretamente (só falta `/dev/`, item 4).
