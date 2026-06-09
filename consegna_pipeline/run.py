"""Punto d'ingresso unico della pipeline.

Esempi:
  python run.py --initial     # elabora il lotto iniziale (data/raw)
  python run.py --update      # elabora il lotto di aggiornamento (data/raw_update)
  python run.py --query       # stampa le domande di esempio + la metrica xG
  python run.py --verify      # rilegge il magazzino e ri-asserisce le invarianti
"""
import argparse
import sys

from src import config, pipeline, queries, gold, verify


def _banner() -> None:
    """Piccolo giglio viola all'avvio (codici colore ANSI: \\033[...m)."""
    print("\033[38;5;91m  ⚜  match pipeline · forza viola\033[0m")


def _print_summary(res: dict) -> None:
    print(f"Sorgente: {res['source']}")
    print(f"  elaborate: {len(res['processed'])}  {res['processed']}")
    print(f"  saltate:   {len(res['skipped'])}  (gia' aggiornate)")
    if res["errors"]:
        print(f"  SCARTATE (non valide): {len(res['errors'])}")
        for e in res["errors"]:
            print(f"    - {e}")
    if res["warnings"]:
        print(f"  avvisi qualita': {len(res['warnings'])}")
        for w in res["warnings"][:5]:
            print(f"    ! {w}")
    print(f"  totale partite nel magazzino: {res['total_in_manifest']}")


def _build_gold() -> None:
    """Ricostruisce il layer gold dal silver (se il magazzino esiste)."""
    if (config.WAREHOUSE / "matches").exists():
        con = queries.connect()
        gold.build(con)
        con.close()
        print("  gold aggiornato: warehouse/gold/player_season_stats.parquet")


def _run_queries() -> None:
    con = queries.connect()
    print("\n# Eventi per tipo\n", queries.events_by_type(con))
    print("\n# Top marcatori\n", queries.top_scorers(con))
    print("\n# Precisione passaggi per squadra\n", queries.pass_accuracy_by_team(con))
    print("\n# Metrica: xG per giocatore (top 10)\n", queries.player_xg(con))


def _verify() -> bool:
    """Stampa il report di verifica. Ritorna True se ci sono problemi DURI."""
    con = queries.connect()
    hard, soft = verify.run(con)
    print("\n# Verifica magazzino")
    print("  problemi duri:", "NESSUNO" if not hard else "")
    for h in hard:
        print(f"    ✗ {h}")
    print(f"  avvisi soft (qualita' dato): {len(soft)}")
    for s in soft[:5]:
        print(f"    ! {s}")
    print("  esito:", "OK ✓" if not hard else "FALLITO ✗")
    return bool(hard)


def main() -> None:
    ap = argparse.ArgumentParser(description="Pipeline partite (JSON -> Parquet -> DuckDB)")
    ap.add_argument("--initial", action="store_true", help="elabora il lotto iniziale")
    ap.add_argument("--update", action="store_true", help="elabora il lotto di update")
    ap.add_argument("--query", action="store_true", help="esegui le query di esempio")
    ap.add_argument("--verify", action="store_true", help="verifica le invarianti del magazzino")
    ap.add_argument("--all", action="store_true",
                    help="tutto in fila: initial -> update -> query -> verify")
    args = ap.parse_args()

    # --all accende l'intera sequenza; altrimenti valgono i flag singoli.
    do_initial = args.initial or args.all
    do_update = args.update or args.all
    do_query = args.query or args.all
    do_verify = args.verify or args.all

    if not (do_initial or do_update or do_query or do_verify):
        ap.print_help()
        return

    _banner()
    if do_initial:
        _print_summary(pipeline.run(config.RAW_INITIAL))
        _build_gold()
    if do_update:
        _print_summary(pipeline.run(config.RAW_UPDATE))
        _build_gold()
    if do_query:
        _run_queries()
    if do_verify and _verify():
        sys.exit(1)     # esce con errore: utile in CI


if __name__ == "__main__":
    main()
