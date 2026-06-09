/* Viola Analytics — main app orchestrator */
const VANS_APP = window.ViolaAnalyticsFiorentinaDesignSystem_48fef3;

function App() {
  const { Dropzone } = VANS_APP;
  const [rows, setRows] = React.useState(null);
  const [fileName, setFileName] = React.useState(null);
  const [error, setError] = React.useState(null);

  const [filters, setFilters] = React.useState({
    competition: [], season: [], team: [], minMinutes: 0, per90: false,
  });
  const [metric, setMetric] = React.useState('goals');
  const [topN, setTopN] = React.useState(10);
  const [selected, setSelected] = React.useState(null);

  const setF = (patch) => setFilters((f) => ({ ...f, ...patch }));

  /* ---- ingest ---- */
  const ingest = React.useCallback((newRows, name) => {
    setRows(newRows);
    setFileName(name);
    setError(null);
    setFilters((f) => ({ ...f, competition: [], season: [], team: [], minMinutes: 0 }));
    setSelected(null);
  }, []);

  const handleFile = React.useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = window.VAData.parseCsv(String(e.target.result));
        ingest(parsed, file.name);
      } catch (err) {
        setError(err.message || 'File non leggibile.');
        setRows(null); setFileName(null);
      }
    };
    reader.onerror = () => setError('Impossibile leggere il file.');
    reader.readAsText(file);
  }, [ingest]);

  const loadSample = React.useCallback(() => {
    ingest(window.VASample.generate(), 'esempio_fiorentina_2024-26.csv');
  }, [ingest]);

  /* ---- derived ---- */
  const options = React.useMemo(() => {
    if (!rows) return { competitions: [], seasons: [], teams: [] };
    return {
      competitions: window.VAData.distinct(rows, 'competition'),
      seasons: window.VAData.distinct(rows, 'season'),
      teams: window.VAData.distinct(rows, 'team_id'),
    };
  }, [rows]);

  const filteredRows = React.useMemo(
    () => (rows ? window.VAData.applyFilters(rows, filters) : []),
    [rows, filters]
  );

  const maxMinutes = React.useMemo(() => {
    if (!rows) return 3000;
    const mins = window.VAData.totalMinutes(rows);
    return Math.max(90, Math.ceil(Math.max(...Object.values(mins)) / 90) * 90);
  }, [rows]);

  const aggregates = React.useMemo(() => {
    if (!filteredRows.length) return [];
    return window.VAData.aggregate(filteredRows)
      .filter((p) => p.minutes >= filters.minMinutes);
  }, [filteredRows, filters.minMinutes]);

  const ranking = React.useMemo(() => {
    const withVal = aggregates.map((p) => ({ ...p, metricVal: window.VAData.metricValue(p, metric, filters.per90) }))
      .filter((p) => p.metricVal != null)
      .sort((a, b) => b.metricVal - a.metricVal);
    const out = withVal.slice(0, topN);
    out._total = withVal.length;
    return out;
  }, [aggregates, metric, filters.per90, topN]);

  const playerOptions = React.useMemo(
    () => aggregates.slice().sort((a, b) => a.player_name.localeCompare(b.player_name))
      .map((p) => ({ value: p.player_id, label: p.player_name })),
    [aggregates]
  );

  // keep a valid selection
  React.useEffect(() => {
    if (!aggregates.length) { if (selected) setSelected(null); return; }
    if (!selected || !aggregates.find((p) => p.player_id === selected)) {
      // default to current ranking leader
      setSelected((ranking[0] && ranking[0].player_id) || aggregates[0].player_id);
    }
  }, [aggregates, ranking, selected]);

  const selectedStat = React.useMemo(
    () => aggregates.find((p) => p.player_id === selected) || null,
    [aggregates, selected]
  );
  const selectedEvents = React.useMemo(
    () => (selected ? filteredRows.filter((r) => r.player_name === selected && r.x != null && r.y != null)
      .map((r) => ({ x: r.x, y: r.y, type: r.type, outcome: r.outcome, xg: r.xg })) : []),
    [filteredRows, selected]
  );

  const hasData = !!rows;

  return (
    <div className="va-app">
      <Header fileName={fileName} eventCount={rows ? rows.length : 0} onLoadSample={loadSample} />

      <div className="va-upload">
        <Dropzone onFile={handleFile} fileName={fileName} rowCount={rows ? rows.length : null} error={error} />
      </div>

      {!hasData && <EmptyState onLoadSample={loadSample} />}

      {hasData && (
        <>
          <FilterBar options={options} filters={filters} set={setF} maxMinutes={maxMinutes} />
          {aggregates.length === 0 ? (
            <div className="va-noresult">
              Nessun giocatore supera i filtri attuali. Abbassa i «minuti minimi» o allarga la selezione.
            </div>
          ) : (
            <div className="va-grid">
              <RankingSection
                ranking={ranking} metric={metric} setMetric={setMetric}
                topN={topN} setTopN={setTopN} per90={filters.per90}
                onPick={setSelected} selected={selected} />
              <PlayerSection
                players={playerOptions} selected={selected} onSelect={setSelected}
                stat={selectedStat} events={selectedEvents} per90={filters.per90} />
            </div>
          )}
        </>
      )}

      <footer className="va-foot mono">
        Viola Analytics · tutto in memoria, nessun dato lascia il browser ·
        <span className="va-foot-egg" title="Forza Viola dal 1926"> ⚜ 1926</span>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
