"""Test del layer gold e del comando verify sul magazzino reale."""
from src import config, gold, pipeline, queries, verify


def test_gold_e_verify():
    # costruisco il magazzino (idempotente) e il gold
    pipeline.run(config.RAW_INITIAL)
    con = queries.connect()
    gold.build(con)

    # il gold esiste ed e' interrogabile
    con2 = queries.connect()
    rows = con2.sql("SELECT count(*) FROM player_season_stats").fetchone()[0]
    assert rows > 0
    cols = {c for c in con2.sql("SELECT * FROM player_season_stats LIMIT 0").df().columns}
    assert {"player_name", "season", "minutes", "xg", "goals_minus_xg"} <= cols

    # verify: nessun problema DURO sulle invarianti
    hard, _soft = verify.run(con2)
    assert hard == []
