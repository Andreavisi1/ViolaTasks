"""Test minimi ma sul punto che conta: l'incrementale e' VERO e idempotente."""
from src import config, pipeline, queries


def test_initial_then_idempotent():
    """Primo run elabora tutto; ri-eseguirlo non deve rielaborare nulla."""
    first = pipeline.run(config.RAW_INITIAL)
    assert len(first["processed"]) == 24      # lotto iniziale = 24 partite
    again = pipeline.run(config.RAW_INITIAL)
    assert again["processed"] == []           # idempotenza: stesso input -> zero lavoro
    assert len(again["skipped"]) == 24


def test_update_processes_only_new_and_changed():
    """L'update tocca solo le 4 nuove + la 1003 corretta: 5 partite, non 29."""
    res = pipeline.run(config.RAW_UPDATE)
    assert len(res["processed"]) == 5
    assert "1003" in res["processed"]          # la partita corretta viene rielaborata


def test_types_and_xg_present():
    """Le colonne chiave sono tipizzate e la metrica xG produce numeri."""
    con = queries.connect()
    schema = con.sql("DESCRIBE events").df()
    types = dict(zip(schema["column_name"], schema["column_type"]))
    assert types["minute"] in ("BIGINT", "INTEGER")
    assert types["xg"] == "DOUBLE"
    xg = queries.player_xg(con)
    assert xg["xg"].iloc[0] > 0
