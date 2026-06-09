"""Punto d'ingresso unico della pipeline.

Esempi:
  python run.py --initial     # elabora il lotto iniziale (data/raw)
  python run.py --update      # elabora il lotto di aggiornamento (data/raw_update)
  python run.py --query       # stampa le domande di esempio + la metrica xG
"""
import argparse

from src import config, pipeline, queries


def _banner() -> None:
    """Piccolo giglio viola all'avvio (codici colore ANSI: \\033[...m)."""
    print("\033[38;5;91m  ⚜  match pipeline · forza viola\033[0m")


def _print_summary(res: dict) -> None:
    print(f"Sorgente: {res['source']}")
    print(f"  elaborate: {len(res['processed'])}  {res['processed']}")
    print(f"  saltate:   {len(res['skipped'])}  (gia' aggiornate)")
    print(f"  totale partite nel magazzino: {res['total_in_manifest']}")


def _run_queries() -> None:
    con = queries.connect()
    print("\n# Eventi per tipo\n", queries.events_by_type(con))
    print("\n# Top marcatori\n", queries.top_scorers(con))
    print("\n# Precisione passaggi per squadra\n", queries.pass_accuracy_by_team(con))
    print("\n# Metrica: xG per giocatore (top 10)\n", queries.player_xg(con))


def main() -> None:
    ap = argparse.ArgumentParser(description="Pipeline partite (JSON -> Parquet -> DuckDB)")
    ap.add_argument("--initial", action="store_true", help="elabora il lotto iniziale")
    ap.add_argument("--update", action="store_true", help="elabora il lotto di update")
    ap.add_argument("--query", action="store_true", help="esegui le query di esempio")
    args = ap.parse_args()

    if args.initial or args.update or args.query:
        _banner()
    if args.initial:
        _print_summary(pipeline.run(config.RAW_INITIAL))
    if args.update:
        _print_summary(pipeline.run(config.RAW_UPDATE))
    if args.query:
        _run_queries()
    if not (args.initial or args.update or args.query):
        ap.print_help()


if __name__ == "__main__":
    main()
