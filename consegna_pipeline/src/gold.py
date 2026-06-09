"""Layer 'gold': metriche pre-aggregate per giocatore-stagione, persistite in Parquet.

Architettura medallion:
  bronze = JSON grezzi (sorgente)
  silver = matches / players / events puliti e tipizzati (l'output della pipeline)
  gold   = tabelle pronte al consumo, gia' aggregate -> questo file

La dashboard e Tableau leggerebbero il gold (piccolo), non gli eventi grezzi.
Aggreghiamo per NOME giocatore perche' nello schema il player_id e' unico per
partita: il nome e' l'identita' stabile tra le gare.
"""
from . import config

GOLD = config.WAREHOUSE / "gold"
SEASON_STATS = GOLD / "player_season_stats.parquet"


def build(con) -> None:
    """Ricostruisce il gold dal silver corrente (idempotente: sovrascrive)."""
    GOLD.mkdir(parents=True, exist_ok=True)
    con.execute(f"""
        COPY (
            WITH pm AS (
                SELECT p.name AS player_name, m.season, p.match_id, p.minutes
                FROM players p JOIN matches m USING (match_id)
            ),
            mins AS (  -- minuti totali: una volta per partita
                SELECT player_name, season, sum(minutes) AS minutes
                FROM (SELECT DISTINCT player_name, season, match_id, minutes FROM pm)
                GROUP BY player_name, season
            ),
            ev AS (
                SELECT p.name AS player_name, m.season,
                       count(*) FILTER (WHERE e.type='shot')                       AS shots,
                       count(*) FILTER (WHERE e.type='shot' AND e.outcome='goal')  AS goals,
                       round(sum(e.xg) FILTER (WHERE e.type='shot'), 2)            AS xg,
                       count(*) FILTER (WHERE e.type='pass')                       AS passes,
                       count(*) FILTER (WHERE e.type='pass' AND e.outcome='complete') AS passes_ok,
                       count(*) FILTER (WHERE e.type='tackle')                     AS tackles,
                       count(*) FILTER (WHERE e.type='tackle' AND e.outcome='won') AS tackles_won
                FROM events e
                JOIN players p ON p.player_id = e.player_id AND p.match_id = e.match_id
                JOIN matches m ON m.match_id = e.match_id
                GROUP BY p.name, m.season
            )
            SELECT mins.player_name, mins.season, mins.minutes,
                   coalesce(ev.goals, 0)                                  AS goals,
                   coalesce(ev.xg, 0)                                     AS xg,
                   round(coalesce(ev.goals,0) - coalesce(ev.xg,0), 2)     AS goals_minus_xg,
                   coalesce(ev.shots, 0)                                  AS shots,
                   round(100.0 * ev.passes_ok / nullif(ev.passes,0), 1)   AS pass_pct,
                   round(100.0 * ev.tackles_won / nullif(ev.tackles,0),1) AS tackle_win_pct
            FROM mins LEFT JOIN ev USING (player_name, season)
            ORDER BY xg DESC
        ) TO '{SEASON_STATS.as_posix()}' (FORMAT parquet)
    """)
