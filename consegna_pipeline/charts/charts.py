"""Genera grafici (PNG) allineati alle 3 metriche scelte. Tema viola (Fiorentina).

Uso:
    python3 charts/charts.py        # salva i PNG in charts/output/

Un grafico per fase di gioco:
  1. Finalizzazione  -> xG attesi vs gol reali
  2. Costruzione     -> passaggi nell'ultimo terzo per 90' (proxy dei progressivi)
  3. Difesa          -> contrasti vinti % vs azioni difensive per 90'
  4. Shot/action map -> posizione degli eventi di un giocatore sul campo

Legge gli stessi Parquet via DuckDB (src.queries): i grafici restano allineati al
magazzino. Aggiorni i dati, rilanci, si rigenerano.
"""
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")  # backend senza finestra: salva su file, non apre schermi
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Circle

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))  # rende importabile src/
from src import queries

VIOLA, VIOLA_CHIARO, GRIGIO = "#6A2C91", "#B07FD0", "#888780"
COLORI_EVENTO = {"pass": "#378ADD", "shot": "#E24B4A", "tackle": "#1D9E75",
                 "dribble": "#EF9F27", "foul": GRIGIO}
OUT = Path(__file__).resolve().parent / "output"
MIN_MINUTI = 180  # soglia per evitare campioni minuscoli (titolari di ~2 partite)

plt.rcParams.update({"font.size": 11, "axes.edgecolor": "#cccccc",
                     "axes.spines.top": False, "axes.spines.right": False})


def per90(serie, minuti):
    """Normalizza un conteggio per 90 minuti giocati."""
    return serie / minuti * 90


def finalizzazione(con, ax, n=10):
    """xG attesi vs gol reali per i migliori finalizzatori."""
    df = queries.leaderboard(con).sort_values("xg", ascending=False).head(n).iloc[::-1]
    y = range(len(df)); h = 0.4
    ax.barh([i + h / 2 for i in y], df["xg"], height=h, color=VIOLA, label="xG (attesi)")
    ax.barh([i - h / 2 for i in y], df["goals"], height=h, color=VIOLA_CHIARO, label="Gol (reali)")
    ax.set_yticks(list(y)); ax.set_yticklabels(df["name"])
    ax.set_title("Finalizzazione — xG attesi vs gol realizzati", fontweight="medium")
    ax.set_xlabel("xG / gol"); ax.legend()


def costruzione(con, ax, n=10):
    """Passaggi completati nell'ultimo terzo per 90' (proxy dei passaggi progressivi)."""
    df = queries.leaderboard(con, min_minutes=MIN_MINUTI).copy()
    df["ft_p90"] = per90(df["passes_final_third"], df["minutes"])
    df = df.sort_values("ft_p90", ascending=False).head(n).iloc[::-1]
    ax.barh(df["name"], df["ft_p90"], color=VIOLA)
    for i, v in enumerate(df["ft_p90"]):
        ax.text(v, i, f" {v:.1f}", va="center", fontsize=10)
    ax.set_title("Costruzione — passaggi nell'ultimo terzo per 90′", fontweight="medium")
    ax.set_xlabel("passaggi completati nell'ultimo terzo / 90′")


def difesa(con, ax):
    """Contrasti vinti % vs azioni difensive per 90' (chi è affidabile e attivo)."""
    df = queries.leaderboard(con, min_minutes=MIN_MINUTI).copy()
    df = df[df["tackles"] >= 5]  # solo chi ha un campione di contrasti sensato
    df["azioni_p90"] = per90(df["tackles"] + df["fouls"], df["minutes"])
    ax.scatter(df["tackle_win_pct"], df["azioni_p90"], s=45, c=VIOLA, alpha=.7,
               edgecolors="white", linewidths=.5)
    ax.axvline(df["tackle_win_pct"].median(), color=GRIGIO, lw=1, ls="--")
    ax.axhline(df["azioni_p90"].median(), color=GRIGIO, lw=1, ls="--")
    ax.set_title("Difesa — affidabilità vs intensità", fontweight="medium")
    ax.set_xlabel("% contrasti vinti"); ax.set_ylabel("azioni difensive / 90′")


def mappa_azioni(con, ax, player_id, titolo):
    """Posizione sul campo di ogni evento del giocatore; i tiri scalano con l'xG."""
    pe = queries.player_events(con, int(player_id))
    ax.add_patch(Rectangle((0, 0), 100, 100, fill=False, ec="#2e7d32", lw=1.5))
    ax.plot([50, 50], [0, 100], color="#2e7d32", lw=1.5)
    ax.add_patch(Circle((50, 50), 9, fill=False, ec="#2e7d32", lw=1.5))
    ax.add_patch(Rectangle((0, 21.5), 16, 57, fill=False, ec="#2e7d32", lw=1.5))
    ax.add_patch(Rectangle((84, 21.5), 16, 57, fill=False, ec="#2e7d32", lw=1.5))
    for tipo, g in pe.groupby("type"):
        if tipo == "shot":
            ax.scatter(g["x"], g["y"], s=30 + g["xg"].fillna(0) * 350, c=COLORI_EVENTO[tipo],
                       alpha=.8, edgecolors="white", linewidths=.5, label="shot", zorder=3)
        else:
            ax.scatter(g["x"], g["y"], s=35, c=COLORI_EVENTO[tipo], alpha=.65, label=tipo)
    ax.set_xlim(-2, 102); ax.set_ylim(-2, 102); ax.axis("off")
    ax.set_title(titolo, fontweight="medium")
    ax.legend(loc="upper center", bbox_to_anchor=(.5, -.02), ncol=5, frameon=False, fontsize=9)


def main():
    OUT.mkdir(exist_ok=True)
    con = queries.connect()

    for nome, disegna, size in [
        ("01_finalizzazione_xg", finalizzazione, (7, 4.5)),
        ("02_costruzione_ultimo_terzo", costruzione, (7, 4.5)),
        ("03_difesa_contrasti", difesa, (7, 4.6)),
    ]:
        fig, ax = plt.subplots(figsize=size)
        disegna(con, ax)
        fig.tight_layout(); fig.savefig(OUT / f"{nome}.png", dpi=150); plt.close(fig)

    top = queries.leaderboard(con).sort_values("xg", ascending=False).iloc[0]
    fig, ax = plt.subplots(figsize=(7, 4.6))
    mappa_azioni(con, ax, top["player_id"],
                 f"Mappa azioni — {top['name']} (xG {top['xg']}, {int(top['goals'])} gol)")
    fig.tight_layout(); fig.savefig(OUT / "04_mappa_azioni.png", dpi=150); plt.close(fig)

    print(f"Grafici salvati in {OUT}/")


if __name__ == "__main__":
    main()
