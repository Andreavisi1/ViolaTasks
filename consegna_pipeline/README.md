# Pipeline partite: JSON → Parquet → DuckDB

Trasforma i JSON delle partite in dati puliti, tipizzati e interrogabili.
È **incrementale**: rieseguire elabora solo le partite nuove o cambiate.
Garanzia di **idempotenza**.

## Requisiti minimi del brief — dove sono soddisfatti

| Requisito | Dove |
| --- | --- |
| JSON → dati puliti, **tipizzati e ordinati** | `src/transform.py` (cast espliciti, eventi ordinati) → Parquet |
| **Interrogabili** (conteggi/filtri) | `src/queries.py` · `python3 run.py --query` |
| **Incrementale vero** (solo partite nuove o cambiate) | `src/pipeline.py` (hash SHA-256 + `_manifest.json`) |
| Gestisce **lotto iniziale e di update** | `--initial` / `--update` (o `--all`) |
| **Un comando + riproducibile** (breve README) | `./run.sh` / `.\run.ps1`; questo file |
| **Codice in più moduli/funzioni** | `src/` (config · extract · transform · validation · load · pipeline · gold · queries · verify) |
| *Opzionale* — una metrica implementata | xG in `src/queries.py` + `src/gold.py` |
| *Opzionale* — test | `tests/` (11 test) + CI |

## Come si esegue

Richiede **Python 3.9+**.

Comando unico, multipiattaforma (installa le dipendenze e fa tutto in fila):

```bash
./run.sh        # macOS / Linux
.\run.ps1       # Windows (PowerShell)
```

Oppure a mano, con i singoli passi:

```bash
python3 -m pip install -r requirements.txt

python3 run.py --all       # initial -> update -> query -> verify, in sequenza
python3 run.py --initial   # solo il lotto iniziale (data/raw)
python3 run.py --update    # solo il lotto di aggiornamento (data/raw_update)
python3 run.py --query     # solo le domande di esempio + metrica xG
python3 run.py --verify    # rilegge il magazzino e ri-asserisce le invarianti

streamlit run app.py       # dashboard interattiva nel browser
python3 charts/charts.py   # genera alcuni grafici interessanti (PNG) in charts/output/
```

## Dashboard (interfaccia) per l'interrogazione

`streamlit run app.py` apre **Viola Analytics**: la dashboard di design (servita da
`static/`, file autosufficiente) incorporata e alimentata dai nostri dati. 

Flusso:
**1)** scarica il CSV (generato al volo da DuckDB sui Parquet puliti), **2)** trascinalo
nell'area di caricamento della dashboard. Il CSV è rigenerato dal magazzino a ogni
apertura — nessun dato duplicato, una sola fonte di verità.

I dati di default sono cercati in `../candidate_dataset/data`.
Per puntare altrove: `CALCIO_DATA=/percorso/data python3 run.py --initial`.

## Cosa produce la pipeline

Un piccolo "magazzino" in Parquet (formato colonnare aperto), in architettura
**medallion** (bronze → silver → gold):

```
warehouse/
  matches/match_id=1003/data.parquet   # silver: anagrafica gara
  players/match_id=1003/data.parquet   # silver: distinta giocatori
  events/match_id=1003/data.parquet    # silver: ogni pass/shot/tackle/dribble/foul
  gold/player_season_stats.parquet     # gold: metriche per giocatore-stagione, pronte all'uso
  _manifest.json                       # stato: {match_id: hash} per l'incrementale
```

I JSON grezzi sono il bronze; il silver è un modello a stella (`events` = fatti,
`matches` e `players` = dimensioni); il gold sono le metriche pre-aggregate che
leggono dashboard e Tableau senza riscandire gli eventi uno ad uno.

## Verifica propedeutica della qualità del dato

La validazione al confine (`src/validation.py`) **rifiuta** i record malformati
(tipo evento o outcome non a schema, coordinate fuori campo, ruolo non valido):
i dati sporchi non entrano nel magazzino. Le incongruenze soft (es. gol che non
tornano col punteggio) sono **segnalate** come avvisi, non bloccano il carico.
`python3 run.py --verify` rilegge poi il magazzino e ri-asserisce le invarianti
(event_id unici, niente null nelle chiavi, manifest allineato ai Parquet).

## Come funziona l'incrementale

Di ogni file calcoliamo un hash SHA-256 del contenuto. Lo confrontiamo con il
`_manifest.json` dell'ultimo run: se l'hash è identico la partita si salta, se è
nuovo o diverso la sua (sola) partizione Parquet viene riscritta. Risultato:
rieseguire sullo stesso lotto non fa nulla (idempotenza), e la partita corretta
`1003` viene rielaborata da sola, senza toccare le altre.

## Struttura del codice

```
run.py             punto d'ingresso (CLI: --initial/--update/--query/--verify/--all)
run.sh / run.ps1   avvio unico cross-OS
app.py             dashboard Streamlit (Viola Analytics)
src/config.py      percorsi e schema
src/extract.py     trova i JSON, li legge, calcola l'hash
src/transform.py   JSON annidato → 3 tabelle piatte e tipizzate
src/validation.py  validazione al confine + avvisi di qualità
src/load.py        scrive Parquet (1 partizione per partita) + manifest
src/pipeline.py    orchestrazione + logica incrementale
src/gold.py        layer gold: metriche per giocatore-stagione
src/queries.py     domande di esempio + metrica xG (SQL su DuckDB)
src/verify.py      ri-asserisce le invarianti del magazzino
charts/charts.py   grafici PNG (tema viola, per fase di gioco)
tests/             pytest: tipizzazione, incrementale, validazione, gold, verify
.github/workflows/ CI: ruff + pytest a ogni push
```

## Test e qualità

```bash
python -m pytest -q     # incrementale, idempotenza, validazione, gold, verify
ruff check src tests    # lint
```

La CI (`.github/workflows/ci.yml`) esegue lint e test su Python 3.10 e 3.12 a
ogni push. I test verificano che il lotto iniziale carichi 24 partite, che
l'update ne tocchi solo 5 (4 nuove + la 1003 corretta), che rieseguire non
rielabori nulla, che i record malformati vengano rifiutati e che `verify` non
trovi problemi.
