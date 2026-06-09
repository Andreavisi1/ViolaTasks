"""Trasformazione: da JSON annidato a 3 tabelle piatte, pulite e TIPIZZATE.

Una partita "esplode" in:
  - matches:  1 riga  (anagrafica della gara)
  - players:  N righe (i giocatori scesi in campo)
  - events:   M righe (ogni pass/shot/tackle/dribble/foul)
"""
import pandas as pd


def match_row(m: dict) -> dict:
    """Anagrafica della partita su una riga sola."""
    return {
        "match_id": int(m["match_id"]),
        "competition": str(m["competition"]),
        "season": str(m["season"]),
        "match_date": pd.to_datetime(m["match_date"]).date(),
        "home_team_id": int(m["home_team"]["team_id"]),
        "home_team": str(m["home_team"]["name"]),
        "away_team_id": int(m["away_team"]["team_id"]),
        "away_team": str(m["away_team"]["name"]),
        "score_home": int(m["score"]["home"]),
        "score_away": int(m["score"]["away"]),
        # presente solo nelle partite ri-esportate: utile per tracciare le correzioni
        "corrected": bool(m.get("corrected", False)),
    }


def players_df(m: dict) -> pd.DataFrame:
    """Distinta dei giocatori della partita."""
    rows = [
        {
            "match_id": int(m["match_id"]),
            "player_id": int(p["player_id"]),
            "name": str(p["name"]),
            "team_id": int(p["team_id"]),
            "position": str(p["position"]),
            "minutes": int(p["minutes"]),
        }
        for p in m["players"]
    ]
    return pd.DataFrame(rows)


def events_df(m: dict) -> pd.DataFrame:
    """Tutti gli eventi della partita, ordinati per minuto/secondo.

    I campi opzionali (recipient_id solo nei passaggi, xg solo nei tiri) vengono
    letti con .get(): se assenti restano nulli, senza rompere lo schema.
    """
    rows = [
        {
            "match_id": int(m["match_id"]),
            "event_id": int(e["event_id"]),
            "minute": int(e["minute"]),
            "second": int(e["second"]),
            "team_id": int(e["team_id"]),
            "player_id": int(e["player_id"]),
            "x": float(e["x"]),
            "y": float(e["y"]),
            "type": str(e["type"]),
            "outcome": e.get("outcome"),
            "recipient_id": e.get("recipient_id"),  # passaggi
            "xg": e.get("xg"),                       # tiri
        }
        for e in m["events"]
    ]
    df = pd.DataFrame(rows).sort_values(["minute", "second", "event_id"])
    # Tipi espliciti: interi che ammettono nulli -> Int64 (con la I maiuscola).
    df["recipient_id"] = df["recipient_id"].astype("Int64")
    df["xg"] = df["xg"].astype("float64")
    return df.reset_index(drop=True)


def transform(m: dict) -> dict[str, pd.DataFrame]:
    """Una partita -> dizionario {tabella: DataFrame}."""
    return {
        "matches": pd.DataFrame([match_row(m)]),
        "players": players_df(m),
        "events": events_df(m),
    }
