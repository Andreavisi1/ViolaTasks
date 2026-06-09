"""Caricamento: scrive le tabelle in Parquet, partizionate per partita.

Layout del magazzino:
  warehouse/events/match_id=1003/data.parquet
  warehouse/matches/match_id=1003/data.parquet
  ...
Partizionare per match_id e' cio' che rende l'incrementale VERO: quando la 1003
viene corretta, riscriviamo solo la sua cartella, non tutto il dataset.
"""
import json
import shutil

import pandas as pd

from . import config


def write_match(tables: dict[str, pd.DataFrame], match_id: int) -> None:
    """Scrive (o sovrascrive) le partizioni Parquet di UNA partita."""
    for name, df in tables.items():
        part = config.WAREHOUSE / name / f"match_id={match_id}"
        if part.exists():
            shutil.rmtree(part)  # sovrascrittura pulita: niente residui della versione vecchia
        part.mkdir(parents=True, exist_ok=True)
        # match_id e' gia' nel nome cartella: lo togliamo dalla colonna per non duplicarlo
        df.drop(columns=["match_id"]).to_parquet(part / "data.parquet", index=False)


def load_manifest() -> dict[str, str]:
    """Stato dell'ultimo run: {match_id: hash}. Vuoto se e' la prima volta."""
    if config.MANIFEST.exists():
        return json.loads(config.MANIFEST.read_text())
    return {}


def save_manifest(manifest: dict[str, str]) -> None:
    config.WAREHOUSE.mkdir(parents=True, exist_ok=True)
    config.MANIFEST.write_text(json.dumps(manifest, indent=2, sort_keys=True))
