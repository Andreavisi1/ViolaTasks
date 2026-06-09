"""Percorsi e costanti dello schema. Un solo posto da toccare se cambia il layout."""
import os
from pathlib import Path

# Radice del progetto = cartella che contiene src/
ROOT = Path(__file__).resolve().parent.parent

# Dati grezzi (i JSON che ci vengono dati). Default: il dataset accanto al progetto;
# si puo' puntare altrove con la variabile d'ambiente CALCIO_DATA.
DATA_DIR = Path(os.environ.get("CALCIO_DATA", ROOT.parent / "candidate_dataset" / "data"))
RAW_INITIAL = DATA_DIR / "raw"          # lotto iniziale
RAW_UPDATE = DATA_DIR / "raw_update"    # lotto di aggiornamento

# Dati puliti (il nostro "magazzino" in Parquet) + stato per l'incrementale.
WAREHOUSE = ROOT / "warehouse"
MANIFEST = WAREHOUSE / "_manifest.json"

# Le tre tabelle che produciamo (modello a stella: events = fatti, le altre = dimensioni).
TABLES = ("matches", "players", "events")
