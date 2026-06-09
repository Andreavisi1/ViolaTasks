#!/usr/bin/env bash
# Avvio unico (macOS / Linux). Installa le dipendenze, esegue la pipeline e apre la dashboard.
#   ./run.sh            -> pipeline completa (initial, update, query, verify) + dashboard
#   ./run.sh --query    -> solo le query (qualsiasi argomento di run.py e' valido)
set -e
cd "$(dirname "$0")"

echo "[1/2] Installazione dipendenze (pip install -r requirements.txt)..."
python3 -m pip install -q -r requirements.txt
echo "      dipendenze pronte."
echo

echo "[2/2] Avvio pipeline..."
if [ "$#" -eq 0 ]; then
  python3 run.py --all
  echo
  echo "Apro la dashboard Viola Analytics nel browser (Ctrl+C per chiudere)..."
  python3 -m streamlit run app.py
else
  python3 run.py "$@"
fi
