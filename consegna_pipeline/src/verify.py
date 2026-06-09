"""Verifica post-scrittura: rilegge il magazzino e ri-asserisce le invarianti.

La validazione controlla l'input in ingresso; `verify` e' un secondo parere
INDIPENDENTE che legge cio' che e' davvero finito su disco. Ricalcola dai Parquet
scritti, quindi prenderebbe anche un bug nello scrittore. Utile come smoke-test
post-run o in CI.

Distingue problemi DURI (rompono le promesse della pipeline) da avvisi SOFT
(qualita' del dato sorgente, es. gol che non tornano col punteggio).
"""
from . import load


def run(con) -> tuple[list[str], list[str]]:
    """Ritorna (problemi_duri, avvisi_soft)."""
    hard, soft = [], []

    # 1) event_id unici dentro ogni partita (DURO)
    dup = con.sql("""
        SELECT match_id FROM events
        GROUP BY match_id HAVING count(*) <> count(DISTINCT event_id)
    """).fetchall()
    if dup:
        hard.append(f"event_id duplicati in {len(dup)} partite: {[d[0] for d in dup][:5]}")

    # 2) niente null nelle colonne chiave (DURO)
    nulls = con.sql("""
        SELECT count(*) FROM events
        WHERE match_id IS NULL OR player_id IS NULL OR type IS NULL OR minute IS NULL
    """).fetchone()[0]
    if nulls:
        hard.append(f"{nulls} eventi con campi chiave nulli")

    # 3) manifest allineato alle partizioni Parquet presenti (DURO)
    man_ids = {int(k) for k in load.load_manifest()}
    pq_ids = {r[0] for r in con.sql("SELECT DISTINCT match_id FROM matches").fetchall()}
    if man_ids != pq_ids:
        hard.append(f"manifest e Parquet non combaciano: solo manifest {man_ids - pq_ids}, "
                    f"solo Parquet {pq_ids - man_ids}")

    # 4) gol negli eventi vs punteggio finale (SOFT: qualita' del dato sorgente)
    mism = con.sql("""
        SELECT m.match_id, m.score_home + m.score_away AS score,
               count(*) FILTER (WHERE e.type='shot' AND e.outcome='goal') AS goals
        FROM matches m LEFT JOIN events e USING (match_id)
        GROUP BY m.match_id, score HAVING score <> goals
    """).fetchall()
    for match_id, score, goals in mism:
        soft.append(f"match {match_id}: {goals} gol negli eventi vs {score} nel punteggio")

    return hard, soft
