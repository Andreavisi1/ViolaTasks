"""Interrogazioni con DuckDB direttamente sui Parquet (zero import: SQL sui file).

Qui vivono sia le domande di esempio (conteggi/filtri) sia la metrica implementata:
l'xG per giocatore.
"""
import duckdb

from . import config


def connect() -> duckdb.DuckDBPyConnection:
    """Apre DuckDB e registra le 3 tabelle come VIEW sui Parquet partizionati.

    hive_partitioning=1 fa si' che DuckDB recuperi match_id dal nome della cartella.
    """
    con = duckdb.connect()
    for t in config.TABLES:
        glob = (config.WAREHOUSE / t / "**" / "*.parquet").as_posix()
        con.execute(
            f"CREATE VIEW {t} AS "
            f"SELECT * FROM read_parquet('{glob}', hive_partitioning=1)"
        )
    # Vista gold (se gia' costruita): metriche per giocatore-stagione pronte all'uso.
    gold = config.WAREHOUSE / "gold" / "player_season_stats.parquet"
    if gold.exists():
        con.execute(f"CREATE VIEW player_season_stats AS "
                    f"SELECT * FROM read_parquet('{gold.as_posix()}')")
    return con


# --- Domande di esempio (conteggi e filtri) ------------------------------------

def events_by_type(con):
    return con.sql("""
        SELECT type, count(*) AS n
        FROM events GROUP BY type ORDER BY n DESC
    """).df()


def top_scorers(con, limit=5):
    return con.sql(f"""
        SELECT e.player_id, p.name, count(*) AS goals
        FROM events e
        JOIN players p ON p.player_id = e.player_id AND p.match_id = e.match_id
        WHERE e.type = 'shot' AND e.outcome = 'goal'
        GROUP BY e.player_id, p.name
        ORDER BY goals DESC LIMIT {limit}
    """).df()


def pass_accuracy_by_team(con):
    return con.sql("""
        SELECT team_id,
               count(*) AS passes,
               round(100.0 * sum(CASE WHEN outcome='complete' THEN 1 ELSE 0 END)
                     / count(*), 1) AS pct_completed
        FROM events WHERE type = 'pass'
        GROUP BY team_id ORDER BY pct_completed DESC
    """).df()


# --- Metrica implementata: xG per giocatore ------------------------------------

def player_xg(con, limit=10):
    """Expected Goals (xG) per giocatore: somma della probabilita' di gol dei suoi tiri.

    L'xG stima quanti gol "ci si aspetterebbe" dai tiri tentati, data la loro qualita'.
    Confrontarlo con i gol reali dice se un giocatore sta segnando piu' (o meno) del previsto.
    """
    return con.sql(f"""
        SELECT player_id,
               count(*)                                          AS shots,
               round(sum(xg), 2)                                 AS xg,
               sum(CASE WHEN outcome='goal' THEN 1 ELSE 0 END)   AS goals,
               round(sum(CASE WHEN outcome='goal' THEN 1 ELSE 0 END) - sum(xg), 2)
                                                                 AS goals_minus_xg
        FROM events WHERE type = 'shot'
        GROUP BY player_id
        ORDER BY xg DESC LIMIT {limit}
    """).df()


# --- Query parametriche per la dashboard (filtri: competizione/stagione/squadra) --

def list_competitions(con):
    return [r[0] for r in con.sql("SELECT DISTINCT competition FROM matches ORDER BY 1").fetchall()]


def list_seasons(con):
    return [r[0] for r in con.sql("SELECT DISTINCT season FROM matches ORDER BY 1").fetchall()]


def list_teams(con):
    """Coppie (team_id, nome): le squadre vivono in matches come casa/trasferta."""
    return con.sql("""
        SELECT DISTINCT home_team_id AS team_id, home_team AS name FROM matches
        UNION
        SELECT DISTINCT away_team_id, away_team FROM matches
        ORDER BY name
    """).df()


def _filters(competitions, seasons, teams, team_alias):
    """Costruisce la clausola WHERE e i parametri, per non scrivere SQL fragile a mano."""
    clauses, params = [], []
    if competitions:
        clauses.append(f"m.competition IN ({','.join(['?'] * len(competitions))})")
        params += list(competitions)
    if seasons:
        clauses.append(f"m.season IN ({','.join(['?'] * len(seasons))})")
        params += list(seasons)
    if teams:
        clauses.append(f"{team_alias}.team_id IN ({','.join(['?'] * len(teams))})")
        params += list(teams)
    where = (" WHERE " + " AND ".join(clauses)) if clauses else ""
    return where, params


def leaderboard(con, competitions=None, seasons=None, teams=None, min_minutes=0):
    """Una riga per giocatore con tutte le metriche, filtrabile.

    I minuti li sommo dalla tabella players (servono per il 'per 90'); gli eventi
    li conto con FILTER, che e' il modo pulito in SQL di contare 'solo se condizione'.
    """
    w_p, p_params = _filters(competitions, seasons, teams, "p")
    w_e, e_params = _filters(competitions, seasons, teams, "e")
    sql = f"""
    WITH mins AS (
        SELECT p.player_id,
               any_value(p.name)    AS name,
               any_value(p.team_id) AS team_id,
               sum(p.minutes)       AS minutes
        FROM players p JOIN matches m USING (match_id){w_p}
        GROUP BY p.player_id
    ),
    evt AS (
        SELECT e.player_id,
               count(*) FILTER (WHERE e.type='shot')                          AS shots,
               count(*) FILTER (WHERE e.type='shot' AND e.outcome='goal')     AS goals,
               round(sum(e.xg) FILTER (WHERE e.type='shot'), 2)               AS xg,
               count(*) FILTER (WHERE e.type='pass')                          AS passes,
               count(*) FILTER (WHERE e.type='pass' AND e.outcome='complete') AS passes_ok,
               count(*) FILTER (WHERE e.type='tackle')                        AS tackles,
               count(*) FILTER (WHERE e.type='tackle' AND e.outcome='won')    AS tackles_won,
               count(*) FILTER (WHERE e.type='foul')                          AS fouls,
               count(*) FILTER (WHERE e.type='dribble' AND e.outcome='complete') AS dribbles_ok,
               -- proxy di "passaggi progressivi": completati nell'ultimo terzo (x>=66.6)
               count(*) FILTER (WHERE e.type='pass' AND e.outcome='complete' AND e.x >= 66.6) AS passes_final_third
        FROM events e JOIN matches m USING (match_id){w_e}
        GROUP BY e.player_id
    )
    SELECT mins.player_id, mins.name, mins.team_id, mins.minutes,
           coalesce(evt.goals, 0)                                   AS goals,
           coalesce(evt.xg, 0)                                      AS xg,
           round(coalesce(evt.goals, 0) - coalesce(evt.xg, 0), 2)   AS goals_minus_xg,
           coalesce(evt.shots, 0)                                   AS shots,
           coalesce(evt.passes_ok, 0)                               AS passes_ok,
           round(100.0 * evt.passes_ok / nullif(evt.passes, 0), 1)  AS pass_pct,
           round(100.0 * evt.tackles_won / nullif(evt.tackles, 0), 1) AS tackle_win_pct,
           coalesce(evt.tackles, 0)                                 AS tackles,
           coalesce(evt.fouls, 0)                                   AS fouls,
           coalesce(evt.dribbles_ok, 0)                             AS dribbles_ok,
           coalesce(evt.passes_final_third, 0)                      AS passes_final_third
    FROM mins LEFT JOIN evt USING (player_id)
    WHERE mins.minutes >= ?
    ORDER BY goals DESC, xg DESC
    """
    return con.execute(sql, p_params + e_params + [min_minutes]).df()


def player_events(con, player_id):
    """Tutti gli eventi di un giocatore, per la 'mappa azioni' (coordinate x/y)."""
    return con.execute(
        "SELECT minute, x, y, type, outcome, xg FROM events "
        "WHERE player_id = ? ORDER BY minute, second", [player_id]
    ).df()


def events_flat_df(con):
    """Tabella piatta (eventi + contesto partita + giocatore) come DataFrame.

    Stesso contenuto di un export CSV, ma restituito in memoria: serve ad alimentare
    interfacce esterne (es. la dashboard di design) con un download al volo, senza
    scrivere file sul disco.
    """
    return con.sql("""
        SELECT e.match_id, m.competition, m.season, m.match_date, e.team_id,
               e.player_id, p.name AS player_name, p.minutes AS player_minutes,
               e.minute, e.second, e.x, e.y, e.type, e.outcome, e.xg
        FROM events e
        JOIN matches m USING (match_id)
        JOIN players p ON p.player_id = e.player_id AND p.match_id = e.match_id
        ORDER BY e.match_id, e.minute, e.second
    """).df()
