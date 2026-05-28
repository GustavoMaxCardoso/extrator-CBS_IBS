#!/usr/bin/env bash
# ─────────────────────────────────────────────────────
#  Extrator NF-e — IBS & CBS
#  Abre a ferramenta no navegador padrão
# ─────────────────────────────────────────────────────

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HTML="$DIR/index.html"

echo ""
echo "  Extrator NF-e — IBS & CBS"
echo "  Abrindo no navegador..."
echo ""

if command -v xdg-open &>/dev/null; then
  xdg-open "$HTML"
elif command -v open &>/dev/null; then
  open "$HTML"
else
  echo "  Não foi possível abrir automaticamente."
  echo "  Abra manualmente o arquivo: index.html"
fi
