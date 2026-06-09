"""Orchestrazione: mette in fila extract -> transform -> load, con la logica incrementale.

Regola: una partita viene (ri)elaborata SOLO se e' nuova o se il suo hash e' cambiato.
Tutto il resto viene saltato. Ri-eseguire sullo stesso lotto non fa nulla (idempotenza).
"""
from pathlib import Path

from . import extract, load, transform, validation


def run(source_dir: Path) -> dict:
    """Elabora un lotto. Ritorna un riepilogo (utile per log e test)."""
    manifest = load.load_manifest()
    files = extract.discover_matches(source_dir)

    processed, skipped, warnings, errors = [], [], [], []
    for path in files:
        h = extract.content_hash(path)
        # match_id dal nome file (es. 1003.json -> "1003"), robusto e veloce
        match_id = path.stem

        if manifest.get(match_id) == h:
            skipped.append(match_id)        # contenuto identico -> salto
            continue

        match = extract.load_match(path)
        try:
            warnings += validation.validate_match(match)   # avvisi soft (non bloccano)
        except validation.ValidationError as ex:
            errors.append(f"{match_id}: {ex}")             # quarantena: non entra
            continue

        tables = transform.transform(match)
        load.write_match(tables, int(match_id))
        manifest[match_id] = h              # aggiorno lo stato solo se caricata
        processed.append(match_id)

    load.save_manifest(manifest)
    return {
        "source": str(source_dir),
        "processed": processed,
        "skipped": skipped,
        "warnings": warnings,
        "errors": errors,
        "total_in_manifest": len(manifest),
    }
