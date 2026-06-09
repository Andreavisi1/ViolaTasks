"""Verifica post-scrittura: rilegge il magazzino e ri-asserisce le invarianti.

La validazione controlla l'input in ingresso; `verify` e' un secondo parere
INDIPENDENTE che legge cio' che e' davvero finito su disco. Ricalcola dai Parquet
scritti, quindi prenderebbe anche un bug nello scrittore. Utile come smoke-test
post-run o in CI.

Distingue problemi DURI (rompono le promesse della pipeline) da avvisi SOFT
(qualita' del dato sorgente, es. gol che non tornano col punteggio).
"""
from . import load


def run(con) -> tuple[list[tuple[str, bool, str]], list[str]]:
    """Esegue i controlli di integrità rileggendo i Parquet.

    Ritorna:
      - checks: lista di (descrizione, superato, dettaglio) per ogni invariante;
      - warnings: avvisi di qualità del dato (non bloccanti).
    """
    checks, warnings = [], []

    # Invariante 1 — chiave naturale: event_id univoco entro la partita.
    dup = con.sql("""
        SELECT match_id FROM events
        GROUP BY match_id HAVING count(*) <> count(DISTINCT event_id)
    """).fetchall()
    checks.append((
        "event_id univoco all'interno di ogni partita",
        not dup,
        f"{len(dup)} partite con id duplicati" if dup else "",
    ))

    # Invariante 2 — completezza: nessun null nelle colonne chiave.
    nulls = con.sql("""
        SELECT count(*) FROM events
        WHERE match_id IS NULL OR player_id IS NULL OR type IS NULL OR minute IS NULL
    """).fetchone()[0]
    checks.append((
        "nessun valore nullo nelle colonne chiave (match_id, player_id, type, minute)",
        nulls == 0,
        f"{nulls} eventi incompleti" if nulls else "",
    ))

    # Invariante 3 — coerenza stato/dati: il manifest combacia con le partizioni su disco.
    man_ids = {int(k) for k in load.load_manifest()}
    pq_ids = {r[0] for r in con.sql("SELECT DISTINCT match_id FROM matches").fetchall()}
    checks.append((
        "il manifest dell'incrementale combacia con le partizioni Parquet scritte",
        man_ids == pq_ids,
        f"disallineate: {sorted(man_ids ^ pq_ids)}" if man_ids != pq_ids else "",
    ))

    # Qualità del dato (sorgente) — non blocca: gol negli eventi vs punteggio finale.
    mism = con.sql("""
        SELECT m.match_id, m.score_home + m.score_away AS score,
               count(*) FILTER (WHERE e.type='shot' AND e.outcome='goal') AS goals
        FROM matches m LEFT JOIN events e USING (match_id)
        GROUP BY m.match_id, score HAVING score <> goals
    """).fetchall()
    for match_id, score, goals in mism:
        warnings.append(f"partita {match_id}: {goals} gol negli eventi, {score} nel punteggio finale")

    return checks, warnings
