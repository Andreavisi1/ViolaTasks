/* Viola Analytics dashboard — sections. Exports to window. */
const VANS = window.ViolaAnalyticsFiorentinaDesignSystem_48fef3;

/* ---------- Header (with easter eggs) ---------------------- */
function Header({ fileName, eventCount, onLoadSample }) {
  const ballRef = React.useRef(null);
  const spin = () => {
    const b = ballRef.current;
    if (!b) return;
    b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
  };
  return (
    <header className="va-header">
      <div className="va-brand">
        <div className="va-crest-wrap" onClick={spin} title="Fondata nel 1926 · Forza Viola">
          <img className="va-crest" src="../../assets/fiorentina-crest.png" alt="ACF Fiorentina" />
          <span className="va-ball" ref={ballRef}>⚽</span>
          <span className="va-1926">EST. 1926</span>
        </div>
        <div className="va-word">
          <div className="va-word-v">Viola <span>Analytics</span></div>
          <div className="va-word-a">Match Analysis · Data Engineering Desk</div>
        </div>
      </div>
      <div className="va-headmeta">
        {fileName ? (
          <div className="va-pill-file">
            <span className="va-dot-live" />
            <span className="mono">{fileName}</span>
            <span className="va-sep">·</span>
            <span className="mono">{eventCount.toLocaleString('it-IT')} eventi</span>
          </div>
        ) : (
          <VANS.Button variant="secondary" size="sm" onClick={onLoadSample}>Carica dataset d'esempio</VANS.Button>
        )}
      </div>
    </header>
  );
}

/* ---------- Empty state ------------------------------------ */
function EmptyState({ onLoadSample }) {
  return (
    <div className="va-empty">
      <div className="va-empty-icon">⚽</div>
      <h2>Carica un CSV per iniziare l'analisi</h2>
      <p>
        Trascina il file degli eventi nell'area qui sopra, oppure usa un dataset d'esempio.
        La dashboard si ricalcola e si ridisegna in tempo reale a ogni file caricato — niente ricarica pagina.
      </p>
      <VANS.Button variant="primary" onClick={onLoadSample}>Prova con un dataset d'esempio</VANS.Button>
      <div className="va-empty-cols mono">
        match_id · competition · season · match_date · team_id · player_id · player_name ·
        player_minutes · minute · second · x · y · type · outcome · xg
      </div>
    </div>
  );
}

/* ---------- Filter bar ------------------------------------- */
function FilterBar({ options, filters, set, maxMinutes }) {
  const { Select, Slider, Switch, Tooltip, InfoDot } = VANS;
  return (
    <div className="va-filters">
      <div className="va-filters-grid">
        <Select label="Competizione" multi placeholder="Tutte"
          options={options.competitions} value={filters.competition}
          onChange={(v) => set({ competition: v })} />
        <Select label="Stagione" multi placeholder="Tutte"
          options={options.seasons} value={filters.season}
          onChange={(v) => set({ season: v })} />
        <Select label="Squadra" multi placeholder="Tutte"
          options={options.teams} value={filters.team}
          onChange={(v) => set({ team: v })} />
        <Slider label="Minuti giocati minimi" suffix="′" min={0} max={maxMinutes} step={45}
          value={filters.minMinutes} onChange={(v) => set({ minMinutes: v })} />
      </div>
      <div className="va-filters-foot">
        <Switch checked={filters.per90} onChange={(v) => set({ per90: v })}
          label="Normalizza per 90′"
          hint="Divide le metriche di conteggio per i minuti totali × 90. Le percentuali non si normalizzano — confronta titolari e subentrati a parità di tempo." />
      </div>
    </div>
  );
}

/* ---------- Ranking section (Chart.js) --------------------- */
function RankingSection({ ranking, metric, setMetric, topN, setTopN, per90, onPick, selected }) {
  const { Card, MetricSelector, Slider, StatTable, InfoDot } = VANS;
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;
    const labels = ranking.map((r) => r.player_name);
    const data = ranking.map((r) => r.metricVal ?? 0);
    const colors = ranking.map((r) => (r.player_id === selected
      ? getCSS('--accent-500') : getCSS('--viola-600')));
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 5, barThickness: 'flex', maxBarThickness: 22 }] },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        onClick: (evt, els) => { if (els && els[0]) onPick(ranking[els[0].index].player_id); },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: getCSS('--viola-900'), padding: 10, cornerRadius: 8,
            titleFont: { family: getCSS('--font-body'), weight: '600' },
            bodyFont: { family: getCSS('--font-mono') },
            callbacks: { label: (c) => '  ' + fmtMetric(metric, c.parsed.x) },
          },
        },
        scales: {
          x: { grid: { color: 'rgba(36,14,61,0.07)' }, ticks: { font: { family: getCSS('--font-mono'), size: 11 }, color: getCSS('--text-muted') } },
          y: { grid: { display: false }, ticks: { font: { family: getCSS('--font-body'), size: 12, weight: '500' }, color: getCSS('--text-secondary') } },
        },
        animation: { duration: 450, easing: 'easeOutQuart' },
      },
    });
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [ranking, metric, selected]);

  const metricMeta = window.VAData.METRICS.find((m) => m.value === metric);
  const cols = [
    { key: 'player_name', label: 'Giocatore', bold: true },
    { key: 'minutes', label: 'Min', align: 'right', mono: true, muted: true, render: (v) => Math.round(v) },
    { key: 'metricVal', label: metricMeta.label, align: 'right', mono: true, accent: true,
      render: (v) => (v == null ? '—' : metricMeta.fmt(v)) },
  ];

  return (
    <Card eyebrow="Sezione 1" title="Classifica giocatori"
      actions={<span className="va-help-inline">xG <InfoDot label="Gol attesi: stima dei gol dalla qualità dei tiri. «Gol − xG» dice se finalizza sopra o sotto le attese." /></span>}>
      <MetricSelector value={metric} onChange={setMetric}
        options={window.VAData.METRICS.map((m) => ({ value: m.value, label: m.label }))} />
      <div className="va-rank-controls">
        <Slider label="Top N" value={topN} onChange={setTopN} min={3} max={Math.max(3, ranking._total || 14)} />
        {per90 && <span className="va-per90-tag mono">per 90′</span>}
      </div>
      <div className="va-chart" style={{ height: Math.max(180, ranking.length * 30 + 24) }}>
        <canvas ref={canvasRef} />
      </div>
      <div className="va-rank-table">
        <StatTable rank rows={ranking}
          highlightKey={{ field: 'player_id', value: selected }}
          columns={cols} onSort={null} />
      </div>
      <p className="va-cap">Clicca una barra o una riga per aprire la scheda del giocatore.</p>
    </Card>
  );
}

/* ---------- Player section (KPIs + pitch) ------------------ */
function PlayerSection({ players, selected, onSelect, stat, events, per90 }) {
  const { Card, Select, KpiCard, PitchMap, Legend, InfoDot, Badge } = VANS;
  if (!stat) return null;
  const num = (v, d = 0) => (v == null ? '—' : v.toFixed(d));
  const goalsXg = stat.g_xg;
  return (
    <Card tone="brand" eyebrow="Sezione 2" title="Scheda giocatore"
      actions={
        <Select options={players} value={selected} onChange={onSelect}
          style={{ minWidth: 200 }} />
      }>
      <div className="va-kpis">
        <KpiCard label="Minuti" value={Math.round(stat.minutes).toLocaleString('it-IT')} unit="′" />
        <KpiCard label="Gol" value={stat.goals} />
        <KpiCard label="xG" value={num(stat.xg, 2)}
          hint={<InfoDot label="Gol attesi dalla qualità dei tiri." />} />
        <KpiCard label="Gol − xG" value={(goalsXg > 0 ? '+' : '') + num(goalsXg, 2)} accent
          delta={goalsXg > 0 ? 'sopra le attese' : goalsXg < 0 ? 'sotto le attese' : 'in linea'}
          deltaTone={goalsXg > 0 ? 'positive' : goalsXg < 0 ? 'danger' : 'neutral'}
          hint={<InfoDot label="Positivo = finalizza meglio della media dei suoi tiri." />} />
        <KpiCard label="% Passaggi" value={stat.pass_pct == null ? '—' : num(stat.pass_pct, 1)} unit={stat.pass_pct == null ? '' : '%'} />
        <KpiCard label="% Contrasti" value={stat.tackle_pct == null ? '—' : num(stat.tackle_pct, 1)} unit={stat.tackle_pct == null ? '' : '%'} />
      </div>

      <div className="va-pitch-block">
        <div className="va-pitch-head">
          <h4>Mappa azioni</h4>
          <Badge tone="viola" dot>{events.length} eventi</Badge>
        </div>
        <PitchMap events={events} />
        <div className="va-pitch-foot">
          <Legend />
          <p className="va-cap">
            Attacco verso <b>destra</b> → · x:0 porta propria, x:100 porta avversaria ·
            dimensione del tiro ∝ xG · bordo bianco = gol.
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ---------- helpers ---------------------------------------- */
function getCSS(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
function fmtMetric(metric, v) {
  const m = window.VAData.METRICS.find((x) => x.value === metric);
  return m ? `${m.label}: ${m.fmt(v)}` : String(v);
}

Object.assign(window, { Header, EmptyState, FilterBar, RankingSection, PlayerSection });
