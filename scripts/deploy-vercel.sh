#!/usr/bin/env bash
#
# deploy-vercel.sh — Deploy SEGURO do site Siding Depot para produção.
# ---------------------------------------------------------------------
# Evita os 3 erros que já aconteceram:
#   1) Publicar na CONTA/PROJETO errado (bionicaosilva em vez de bx4usa).
#   2) Deploy recusado por CRON sub-diário (Hobby só aceita 1x/dia).
#   3) Rodar com o servidor de dev ocupando o terminal.
#
# COMO USAR (no seu Mac, dentro da pasta do site):
#   cd ~/Desktop/"Projeto SidingDdept-jun-26 finalizado"/sidingdepot-site
#   bash scripts/deploy-vercel.sh
#
# Requisitos: Vercel CLI (via npx) e estar logado na conta bx4usa.
#   - Se não estiver: npx vercel logout ; npx vercel login  (entre com bx4usa@gmail.com)
#     depois: rm -rf .vercel ; npx vercel link  (escolha o scope bx4usa e o projeto correto)

set -euo pipefail
cd "$(dirname "$0")/.."

# ── Alvo correto (NÃO alterar sem confirmar) ─────────────────────────────
CORRECT_PROJECT_ID="prj_kTYtMdpxPV7T4XCjRbtBN3QGIe5N"   # bx4usa / sidingdepotv3.vercel.app
ACCOUNT_HINT="bx4usa"
PROD_URL="https://sidingdepotv3.vercel.app"
VERCEL="npx --yes vercel"

echo "▶ Deploy seguro — Siding Depot (site público)"
echo "  Alvo esperado: projeto $CORRECT_PROJECT_ID  ($PROD_URL)"
echo

# ── 1) Cron compatível com o plano (Hobby = no máximo 1x/dia) ────────────
if grep -Eq '"\*/[0-9]+ ' vite.config.ts 2>/dev/null; then
  echo "❌ ABORTADO: existe cron sub-diário (*/N) no vite.config.ts — quebra em conta Hobby:"
  grep -nE '"\*/[0-9]+ ' vite.config.ts || true
  echo "   Ajuste para rodar no máximo 1x/dia antes de publicar."
  exit 1
fi
echo "✓ Crons OK (nenhum sub-diário)."

# ── 2) Conta logada ──────────────────────────────────────────────────────
WHO="$($VERCEL whoami 2>/dev/null || true)"
echo "  Conta logada na Vercel CLI: ${WHO:-<desconhecida>}"
if [ -n "$WHO" ] && ! echo "$WHO" | grep -qi "$ACCOUNT_HINT"; then
  echo "⚠  Atenção: a conta logada não parece ser '$ACCOUNT_HINT'. Confira antes de continuar."
fi

# ── 3) Projeto linkado tem que ser o correto ─────────────────────────────
PID=""
[ -f .vercel/project.json ] && PID="$(grep -o '"projectId":"[^"]*"' .vercel/project.json | cut -d'"' -f4 || true)"
if [ "$PID" != "$CORRECT_PROJECT_ID" ]; then
  echo "❌ ABORTADO: a pasta está linkada ao projeto ERRADO."
  echo "   Linkado agora: ${PID:-<nenhum>}"
  echo "   Esperado:      $CORRECT_PROJECT_ID  (conta $ACCOUNT_HINT / $PROD_URL)"
  echo
  echo "   Para corrigir:"
  echo "     $VERCEL logout"
  echo "     $VERCEL login          # entre com a conta $ACCOUNT_HINT"
  echo "     rm -rf .vercel"
  echo "     $VERCEL link           # escolha o scope $ACCOUNT_HINT e o projeto correto"
  exit 1
fi
echo "✓ Projeto correto linkado ($PID)."
echo

# ── 4) Confirmar e publicar ──────────────────────────────────────────────
read -r -p "Publicar em PRODUÇÃO ($PROD_URL)? [y/N] " ok
if [ "${ok:-}" != "y" ] && [ "${ok:-}" != "Y" ]; then
  echo "Cancelado. Nada foi publicado."
  exit 0
fi

$VERCEL --prod

echo
echo "✅ Deploy enviado. Verifique em: $PROD_URL"
echo "   Depois rode o PageSpeed Insights nessa URL para conferir o desempenho."
