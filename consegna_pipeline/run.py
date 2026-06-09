"""Punto d'ingresso unico della pipeline.

Esempi:
  python run.py --initial     # elabora il lotto iniziale (data/raw)
  python run.py --update      # elabora il lotto di aggiornamento (data/raw_update)
  python run.py --query       # stampa le domande di esempio + la metrica xG
  python run.py --verify      # rilegge il magazzino e ri-asserisce le invarianti
"""
import argparse
import sys

from src import config, gold, pipeline, queries, verify


def _banner() -> None:
    """Mega logo viola all'avvio: crest Fiorentina in ASCII + titolo (ANSI)."""
    viola = "\033[1;38;5;93m"   # viola brillante, grassetto
    reset = "\033[0m"
    lines = [
        "",
        "                  ::",
        "                :++++:",
        "              :++: .:++:",
        "            :++: :=+-.:++:",
        "          :++:   =+++.  :++:",
        "        :++: :==:.++-.-=-.:++:",
        "      :++:   =+---=+--:=+:  :++:",
        "    :=+:      .  .=+-  .      :+=:",
        "   -*=  ::::::.  .++-  .::::::  =*-",
        "    :=+:.=*****+: .: :+*****=.:+=:",
        "      :++:.-*****+::+*****-.:++:",
        "        :++:.-**********-.:++:",
        "          :++:.-+****+-.:++:",
        "            :++:.-++-.:++:",
        "              :++:  :++:",
        "                :++++:",
        "                  ::",
        "",
        "   █   █  █████  █████  █      █████",
        "   █   █    █    █   █  █      █   █",
        "   █   █    █    █   █  █      █████",
        "    █ █     █    █   █  █      █   █",
        "     █    █████  █████  █████  █   █",
        "",
        "         A  N  A  L  Y  T  I  C  S",
        "   match-event pipeline · ACF Fiorentina · 1926",
        "",
    ]
    print(viola + "\n".join(lines) + reset)


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
        print("  costruisco il layer gold (metriche per giocatore-stagione)...")
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
    """Verifica di integrità: rilegge i Parquet e ricontrolla le invarianti.

    Ritorna True se almeno un'invariante è violata (per uscire con errore in CI).
    """
    con = queries.connect()
    checks, warnings = verify.run(con)
    ok = sum(1 for _, superato, _ in checks if superato)

    print("\n--- Verifica di integrità del magazzino ---")
    print("Rilettura dei Parquet dal disco e controllo delle invarianti garantite dalla pipeline:")
    for descrizione, superato, dettaglio in checks:
        segno = "✓" if superato else "✗"
        riga = f"  {segno}  {descrizione}"
        if dettaglio:
            riga += f"   → {dettaglio}"
        print(riga)

    print(f"  Qualità del dato sorgente: {len(warnings)} avvisi non bloccanti"
          + (" (es. gol che non tornano col punteggio finale):" if warnings else "."))
    for w in warnings[:5]:
        print(f"      · {w}")

    violate = [c for c in checks if not c[1]]
    print(f"  Esito: {'integrità confermata' if not violate else 'VERIFICA FALLITA'} "
          f"({ok}/{len(checks)} invarianti rispettate).")
    return bool(violate)


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
        print("\n=> Lotto iniziale (data/raw)")
        _print_summary(pipeline.run(config.RAW_INITIAL))
        _build_gold()
    if do_update:
        print("\n=> Lotto di aggiornamento (data/raw_update) — incrementale")
        _print_summary(pipeline.run(config.RAW_UPDATE))
        _build_gold()
    if do_query:
        print("\n=> Domande di esempio sui dati")
        _run_queries()
    if do_verify and _verify():
        sys.exit(1)     # esce con errore: utile in CI


if __name__ == "__main__":
    main()
