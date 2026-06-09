# Viola Analytics — Fiorentina tasks

Implementazione di una semplice pipeline incrementale di **event data** calcistico: dai JSON delle partite a dati
puliti, tipizzati e interrogabili, con una dashboard che un analista apre e usa.

## Avvio rapido

```bash
cd consegna_pipeline
./run.sh        # macOS / Linux   (Windows: .\run.ps1)
```

Un comando solo: installa le dipendenze ed esegue tutto in fila: carico iniziale,
update incrementale, query di esempio e verifica del magazzino. Per i singoli
passi: `python3 run.py --initial | --update | --query | --verify | --all`.

`streamlit run app.py` : il run di questo comando apre una dashboard interattiva ad hoc per questo progetto, in cui si possono testare sia dati fittizi (presi da statistiche della squadra viola negli ultimi anni), sia i dati *in formato CSV* del task stesso. 

## Cosa fa la pipeline

Ogni partita JSON diventa Parquet partizionato per partita, interrogato in place
da DuckDB. Architettura **medallion**: bronze (JSON grezzi) → silver
(events/players/matches puliti, modello a stella) → gold (metriche per
giocatore-stagione). L'incrementale è basato su **hash del contenuto** + manifest:
rieseguire elabora solo le partite nuove o cambiate, un re-run identico non fa
nulla (*idempotenza*), la `1003` corretta riscrive solo sé stessa. La **validazione**
al confine rifiuta i dati malformati e segnala le incongruenze soft; `--verify`
rilegge il magazzino e ri-asserisce le invarianti.

## Tech Stack

- **Parquet**: formato colonnare, tipizzato, compresso, aperto: query veloci e nessun
  lock-in. Misurato: su 5M righe, ~28× più veloce e ~3× più compatto del CSV.
- **DuckDB** — motore SQL analitico (OLAP) in-process: legge i Parquet
  direttamente, senza importarli. Molto più rapido di un qualsiasi OLTP.
- **Python + pandas** per leggere/pulire.
- **Streamlit** per la dashboard.
- Scartati CSV (non tipizzato/colonnare) e SQLite (transazionale, non analitico).

## Cosa rende diverso questo lavoro

- **Una dashboard, non solo una CLI.** *Viola Analytics* con design system
  Fiorentina dedicato: classifica giocatori, scheda del
  singolo e **mappa azioni** sul campo, alimentata dai nostri dati via DuckDB.
- **Scelte misurate**: benchmark *reali* Parquet vs CSV, non solo opinioni. I confronti vanno fatti su larga scala. 
- **Rigore**: validazione + data-quality, layer gold, comando `verify`, CI
  (ruff + pytest su 3.10/3.12), test su incrementale e idempotenza.
- **Cultura calcistica**: non basta essere ingegneri. Possedere cultura calcistica aiuta a parlare la lingua del
  settore senza bisogno di intermediari. 

## Struttura

```
consegna_pipeline/   pipeline, dashboard, grafici, test, CI  *(vedi il suo README)*
candidate_dataset/   i dati JSON forniti
Viola Analytics — Fiorentina Design System/   sorgente del design system della dashboard
```

Dettagli ed esecuzione completa: [`consegna_pipeline/README.md`](consegna_pipeline/README.md).
La parte teorica (metriche + data warehouse) è inclusa nella consegna.
