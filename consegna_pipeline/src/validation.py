"""Validazione al confine: i dati sporchi non entrano nel magazzino.

Due categorie di problemi, trattate diversamente (come in una pipeline vera):

- Errori STRUTTURALI — campo obbligatorio mancante, tipo evento sconosciuto,
  outcome non ammesso dallo schema, coordinate fuori range, ruolo non valido.
  Sollevano `ValidationError`: la partita viene messa in quarantena, non caricata.

- Avvisi di QUALITA' — incongruenze "morbide", es. i gol negli eventi che non
  tornano col punteggio finale. Vengono raccolti e restituiti, NON bloccano il
  caricamento (li si segnala, non si butta via il dato).
"""
from __future__ import annotations

# Outcome ammessi per ciascun tipo di evento, presi da SCHEMA.md.
ALLOWED_OUTCOMES = {
    "pass": {"complete", "incomplete"},
    "shot": {"goal", "saved", "off_target", "blocked"},
    "tackle": {"won", "lost"},
    "dribble": {"complete", "incomplete"},
    "foul": {"committed", "won"},
}
VALID_POSITIONS = {"GK", "DF", "MF", "FW", "SUB"}
_REQUIRED = ("match_id", "competition", "season", "match_date",
             "home_team", "away_team", "score", "players", "events")


class ValidationError(Exception):
    """Dato strutturalmente non valido: non deve entrare nel magazzino."""


def validate_match(m: dict) -> list[str]:
    """Valida una partita grezza.

    Solleva ValidationError al primo errore strutturale; altrimenti ritorna la
    lista (eventualmente vuota) di avvisi di qualità non bloccanti.
    """
    for k in _REQUIRED:
        if k not in m:
            raise ValidationError(f"campo obbligatorio mancante: {k}")

    for e in m["events"]:
        t = e.get("type")
        if t not in ALLOWED_OUTCOMES:
            raise ValidationError(f"tipo evento sconosciuto: {t!r}")
        out = e.get("outcome")
        if out is not None and out not in ALLOWED_OUTCOMES[t]:
            raise ValidationError(f"outcome '{out}' non ammesso per il tipo '{t}'")
        for axis in ("x", "y"):
            v = e.get(axis)
            if v is None or not (0.0 <= float(v) <= 100.0):
                raise ValidationError(f"coordinata {axis}={v} fuori dal campo [0, 100]")

    for p in m["players"]:
        if p.get("position") not in VALID_POSITIONS:
            raise ValidationError(f"ruolo non valido: {p.get('position')!r}")

    # --- qualità (soft): i gol negli eventi tornano col punteggio? ---
    warnings = []
    goals = sum(1 for e in m["events"]
                if e.get("type") == "shot" and e.get("outcome") == "goal")
    score = int(m["score"]["home"]) + int(m["score"]["away"])
    if goals != score:
        warnings.append(
            f"match {m['match_id']}: {goals} gol negli eventi ma {score} nel punteggio finale"
        )
    return warnings
