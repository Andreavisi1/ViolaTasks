# Pipeline partite — JSON → Parquet → DuckDB

Trasforma i JSON delle partite in dati puliti, tipizzati e interrogabili.
È **incrementale**: rieseguire elabora solo le partite nuove o cambiate.

## Come si esegue

Richiede **Python 3.9+** (su macOS lancia con `python3`, non `python`).

```bash
python3 -m pip install -r requirements.txt

python3 run.py --initial   # elabora il lotto iniziale (data/raw)
python3 run.py --update    # elabora il lotto di aggiornamento (data/raw_update)
python3 run.py --query     # risponde alle domande di esempio + metrica xG

streamlit run app.py      # mini-dashboard interattiva nel browser
python3 charts/charts.py  # genera i grafici (PNG) in charts/output/
```

## Dashboard (interfaccia)

`streamlit run app.py` apre **Viola Analytics**: la dashboard di design (servita da
`static/`, file autosufficiente) incorporata e alimentata dai nostri dati. Flusso:
**1)** scarica il CSV (generato al volo da DuckDB sui Parquet puliti), **2)** trascinalo
nell'area di caricamento della dashboard. Il CSV è rigenerato dal magazzino a ogni
apertura — nessun dato duplicato, una sola fonte di verità.

I dati di default sono cercati in `../candidate_dataset/data`.
Per puntare altrove: `CALCIO_DATA=/percorso/data python3 run.py --initial`.

## Cosa produce

Un piccolo "magazzino" in Parquet (formato colonnare aperto), partizionato per partita:

```
warehouse/
  matches/match_id=1003/data.parquet   # anagrafica gara
  players/match_id=1003/data.parquet   # distinta giocatori
  events/match_id=1003/data.parquet    # ogni pass/shot/tackle/dribble/foul
  _manifest.json                       # stato: {match_id: hash} per l'incrementale
```

Tre tabelle in modello a stella: `events` sono i fatti, `matches` e `players` le dimensioni.

## Come funziona l'incrementale (in breve)

Di ogni file calcoliamo un hash SHA-256 del contenuto. Lo confrontiamo con il
`_manifest.json` dell'ultimo run: se l'hash è identico la partita si salta, se è
nuovo o diverso la sua (sola) partizione Parquet viene riscritta. Risultato:
rieseguire sullo stesso lotto non fa nulla (idempotenza), e la partita corretta
`1003` viene rielaborata da sola, senza toccare le altre 27.

## Struttura del codice

```
run.py            punto d'ingresso (CLI)
app.py            mini-dashboard Streamlit
src/config.py     percorsi e schema
src/extract.py    trova i JSON, li legge, calcola l'hash
src/transform.py  JSON annidato → 3 tabelle piatte e tipizzate
src/load.py       scrive Parquet (1 partizione per partita) + manifest
src/pipeline.py   orchestrazione + logica incrementale
src/queries.py    domande di esempio + metrica xG (SQL su DuckDB)
tests/            verifica tipizzazione, incrementale e idempotenza
```

## Test

```bash
python -m pytest -q
```

Verificano che il lotto iniziale carichi 24 partite, che l'update ne tocchi solo 5
(4 nuove + la 1003 corretta), che rieseguire non rielabori nulla, e che la metrica
xG produca numeri sensati.
