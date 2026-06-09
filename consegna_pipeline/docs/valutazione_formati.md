# Valutazione dei formati e dei motori

Perché questa pipeline usa **Parquet + DuckDB** e non gli strumenti più ovvi (CSV, SQLite).
Le scelte sono motivate e, dove possibile, misurate sui dati reali.

## I formati di archiviazione

### JSON — la sorgente
È il formato in cui arrivano i dati: leggibile e flessibile, ma **annidato** (oggetti dentro
oggetti) e **prolisso** (ripete le chiavi su ogni record). Ottimo per scambiare dati, pessimo
per interrogarli: non è tabellare e non è tipizzato. Resta la nostra *landing zone* immutabile,
ma non ci lavoriamo direttamente.

### CSV — il minimo comune denominatore
Tabellare, universale, leggibile. Ma ha tre limiti che pesano in analisi:

- **Non è tipizzato**: dentro è tutto testo. Ogni query deve riconvertire "1003" in numero e
  "2024-09-01" in data, ogni volta.
- **Non è colonnare**: per contare i tiri deve leggere e spacchettare tutte le colonne di tutte
  le righe. Niente *projection pushdown* (leggere solo le colonne che servono).
- **Non è compresso**: più byte sul disco, più I/O.

Resta utile come **formato di interscambio** verso sistemi che non leggono altro, ma non è adatto
come archivio di lavoro.

### Parquet — il formato di lavoro
Colonnare, tipizzato (lo schema è scritto nel file), compresso per colonna, e **aperto**
(lo leggono pandas, Polars, Spark, DuckDB, Tableau). Abilita *projection pushdown* (legge solo
le colonne richieste) e *predicate pushdown* (salta i blocchi che non soddisfano il filtro).
Essendo aperto, evita il *vendor lock-in*. È lo standard de-facto dei data lake moderni.

## I motori di interrogazione

### SQLite — transazionale (OLTP)
Database senza server, affidabile e diffuso. Ma è ottimizzato per **transazioni**
(*Online Transaction Processing*): scrivere/leggere poche righe alla volta, come la cassa di
un negozio. Sulle aggregazioni di molte righe non è il suo mestiere, e **non legge i Parquet**:
dovremmo importare i dati a ogni esecuzione.

### DuckDB — analitico (OLAP)
Anch'esso *in-process* e senza server, ma motore **analitico** (*Online Analytical Processing*):
esecuzione vettorizzata (lavora a blocchi di righe), pensata per scansioni e aggregazioni su
grandi volumi. Soprattutto, **legge ed esegue SQL direttamente sui Parquet**, senza ingestion:
storage e calcolo restano disaccoppiati — lo stesso paradigma di Amazon Athena e Google BigQuery,
ma in locale.

## Il confronto, misurato

Stesse query, stessi dati. Su **5 milioni di eventi** generati per il test:

| Formato | Dimensione | Conteggio per tipo | xG per giocatore (filtro+aggregazione) |
| --- | --- | --- | --- |
| **Parquet** | 54.8 MB | **8 ms** | **43 ms** |
| CSV | 164 MB | 231 ms (~28× più lento) | 262 ms (~6× più lento) |

Sul dataset del take-home (≈31.500 eventi) il Parquet è inoltre ~9× più compatto dei JSON di
partenza e ~2.3× del CSV equivalente. Il divario cresce con la mole dei dati: su tracking/GPS da
terabyte diventa la differenza tra una dashboard usabile e una inutilizzabile.

## In sintesi

| Esigenza | Scelta |
| --- | --- |
| Dati in ingresso | JSON (landing zone immutabile) |
| Archivio di lavoro, interrogabile e veloce | **Parquet** (colonnare, tipizzato, compresso, aperto) |
| Motore di query analitiche in locale | **DuckDB** (OLAP, legge i Parquet *in situ*) |
| Interscambio con sistemi esterni | CSV (denormalizzato) |
| Scrittura transazionale riga-per-riga | SQLite — ma non è il nostro caso d'uso |

Regola pratica: **CSV per scambiare, Parquet per conservare e analizzare, DuckDB per interrogare.**
