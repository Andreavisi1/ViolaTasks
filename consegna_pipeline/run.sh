#!/usr/bin/env bash
# Avvio unico (macOS / Linux). Installa le dipendenze e lancia la pipeline.
#   ./run.sh            -> tutto in fila (initial, update, query, verify)
#   ./run.sh --query    -> solo le query (qualsiasi argomento di run.py e' valido)
set -e
cd "$(dirname "$0")"
python3 -m pip install -q -r requirements.txt
if [ "$#" -eq 0 ]; then
  python3 run.py --all
else
  python3 run.py "$@"
fi
