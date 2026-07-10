# Runbook de Deploy — Siding Depot (site público)

> Procedimento seguro para publicar o site em produção **sem repetir os erros que já aconteceram**.
> O site oficial é **https://sidingdepotv3.vercel.app** (conta Vercel **bx4usa**, projeto `prj_kTYtMdpxPV7T4XCjRbtBN3QGIe5N`).

---

## ⚠️ Os 3 erros que este runbook previne

1. **Conta/projeto errado.** A pasta pode estar linkada ao projeto errado (`sidingdepot-site` da conta *bionicaosilva*, alias `sidingdepot-site-five.vercel.app`). O correto é a conta **bx4usa** (alias `sidingdepotv3.vercel.app`).
2. **Cron sub-diário.** Contas **Hobby** (gratuitas) só aceitam cron **1x por dia**. Qualquer `*/15 * * * *` (ou similar) no `vite.config.ts` faz o deploy ser **recusado**.
3. **Terminal ocupado.** Se o `bun run dev` estiver rodando na mesma aba, os comandos caem dentro dele. Use **outra aba** (Cmd+T) para deploy/git.

---

## Caminho rápido (recomendado)

Na pasta do site, em uma aba de terminal livre:

```
bash scripts/deploy-vercel.sh
```

O script verifica conta, projeto e cron **antes** de publicar, e aborta com instruções se algo estiver errado.

---

## Passo a passo manual (se precisar)

### 1. Garantir a conta certa (bx4usa)
```
npx vercel whoami
```
Se não for a conta **bx4usa**:
```
npx vercel logout
npx vercel login
```
No navegador, confirme que está logado como **bx4usa@gmail.com** antes de aprovar o código.

### 2. Garantir o projeto certo
```
cat .vercel/project.json
```
O `projectId` tem que ser `prj_kTYtMdpxPV7T4XCjRbtBN3QGIe5N`. Se não for:
```
rm -rf .vercel
npx vercel link
```
Escolha o scope **bx4usa** e o projeto correto (alias `sidingdepotv3.vercel.app`).

### 3. Commitar no GitHub (fonte da verdade)
```
git add -A
git commit -m "descrição da mudança"
git push origin main
```

### 4. Publicar
```
npx vercel --prod
```
Espere `✓ Ready`. A URL de produção aparece no final.

### 5. Verificar
Abra **https://sidingdepotv3.vercel.app**, confira a mudança e rode o **PageSpeed Insights** para checar o desempenho.

---

## Regras fixas

- **Nunca** publicar na conta *bionicaosilva* (é o projeto errado).
- **Nunca** deixar cron `*/N` no `vite.config.ts` enquanto o plano for Hobby.
- **Sempre** commitar no GitHub antes/depois do deploy (o projeto é git-conectado; a `main` deve refletir o que está no ar).
