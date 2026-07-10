#!/usr/bin/env bash
#
# fix-reviews-env.sh
# ------------------
# Conserta a causa raiz da contagem de avaliações "caindo" para o número fixo.
#
# Diagnóstico (logs de produção do Vercel, rota /__server):
#   "Missing Supabase environment variable(s): SUPABASE_SERVICE_ROLE_KEY"
# => A SUPABASE_SERVICE_ROLE_KEY não está no ambiente de PRODUÇÃO do Vercel,
#    então o servidor não consegue ler o cache de avaliações no Supabase e
#    cai no fallback fixo.
#
# Este script:
#   1. Lista as variáveis de produção já configuradas no Vercel.
#   2. Adiciona SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (lendo o valor do seu
#      .env local) SOMENTE se estiverem faltando.
#   3. Avisa se as chaves do Google (para atualização ao vivo) estão ausentes.
#   4. Ao final, mostra o comando de redeploy para aplicar as variáveis.
#
# COMO RODAR (no seu Mac, dentro da pasta do site):
#   cd ~/Desktop/"Projeto SidingDdept-jun-26 finalizado"/sidingdepot-site
#   bash scripts/fix-reviews-env.sh
#
# Requisitos: Vercel CLI (o script usa `npx vercel`, que instala sob demanda)
#             e o projeto já linkado (existe a pasta .vercel — OK).

set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE=".env"
[ -f "$ENV_FILE" ] || { echo "❌ .env não encontrado em $(pwd)"; exit 1; }

VERCEL="npx --yes vercel"

# Extrai o valor de uma chave do .env local, removendo aspas.
getval() {
  grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2- \
    | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//"
}

echo "▶ Lendo variáveis de PRODUÇÃO já configuradas no Vercel..."
CURRENT="$($VERCEL env ls production 2>/dev/null || true)"
echo "-----------------------------------------------------------"
echo "$CURRENT"
echo "-----------------------------------------------------------"

present() { echo "$CURRENT" | grep -qw "$1"; }

add_from_env() {
  local key="$1" val
  val="$(getval "$key")"
  if [ -z "$val" ]; then
    echo "  ⚠ $key não está no seu .env local — não consigo adicionar."
    return
  fi
  if present "$key"; then
    echo "  ✓ $key já existe na produção — nada a fazer."
  else
    echo "  ➕ Adicionando $key à produção (valor vindo do seu .env local)..."
    printf '%s' "$val" | $VERCEL env add "$key" production >/dev/null \
      && echo "  ✅ $key adicionada." \
      || echo "  ❌ Falha ao adicionar $key (veja a saída do vercel acima)."
  fi
}

echo
echo "▶ SUPABASE (causa raiz):"
add_from_env SUPABASE_URL
add_from_env SUPABASE_SERVICE_ROLE_KEY

echo
echo "▶ GOOGLE (necessário para atualização AO VIVO direto do Google):"
for gk in GOOGLE_PLACES_API_KEY GOOGLE_PLACE_ID; do
  if present "$gk"; then
    echo "  ✓ $gk já existe na produção."
  else
    echo "  ⚠ $gk AUSENTE na produção (e não está no seu .env local)."
    echo "     Para atualização ao vivo direto do Google, adicione manualmente:"
    echo "         $VERCEL env add $gk production"
  fi
done

echo
echo "==========================================================="
echo "Para aplicar as variáveis, faça o redeploy de PRODUÇÃO:"
echo "    $VERCEL --prod"
echo "(deixei como passo separado de propósito — é um deploy público)."
echo "==========================================================="
echo "Depois recarregue o site e confira a contagem de avaliações."
