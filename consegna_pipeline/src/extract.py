"""Estrazione: trova i JSON, li legge, e calcola un'impronta (hash) del contenuto.

L'hash e' il cuore dell'incrementale: se il contenuto di una partita non cambia,
l'hash non cambia, e la partita viene saltata al run successivo.
"""
import hashlib
import json
from pathlib import Path


def discover_matches(source_dir: Path) -> list[Path]:
    """Tutti i file partita sotto la cartella sorgente (ricorsivo, ordinati)."""
    return sorted(source_dir.rglob("*.json"))


def content_hash(path: Path) -> str:
    """SHA-256 dei byte del file: stesso contenuto -> stesso hash (content-addressed)."""
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_match(path: Path) -> dict:
    """Carica un singolo JSON partita."""
    with open(path, encoding="utf-8") as f:
        return json.load(f)
