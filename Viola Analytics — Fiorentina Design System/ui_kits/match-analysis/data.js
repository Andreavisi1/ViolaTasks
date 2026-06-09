/* ============================================================
   Viola Analytics — data layer (plain JS, no JSX)
   Exposes window.VAData: CSV parsing + aggregation.
   Depends on global Papa (PapaParse).
   ============================================================ */
(function () {
  const REQUIRED = ['match_id','player_id','player_name','player_minutes','minute','x','y','type','outcome','xg'];

  function parseCsv(text) {
    const res = Papa.parse(text.trim(), { header: true, skipEmptyLines: true, dynamicTyping: false });
    if (res.errors && res.errors.length) {
      const e = res.errors[0];
      throw new Error(`Riga ${(e.row ?? 0) + 1}: ${e.message}`);
    }
    const cols = res.meta.fields || [];
    const missing = REQUIRED.filter((c) => !cols.includes(c));
    if (missing.length) throw new Error(`Colonne mancanti: ${missing.join(', ')}`);
    const rows = res.data.map(normalizeRow).filter((r) => r.type);
    if (!rows.length) throw new Error('Nessun evento valido trovato nel file.');
    return rows;
  }

  function normalizeRow(r) {
    const num = (v) => (v === '' || v == null ? null : Number(v));
    return {
      match_id: String(r.match_id ?? '').trim(),
      competition: String(r.competition ?? '').trim(),
      season: String(r.season ?? '').trim(),
      match_date: String(r.match_date ?? '').trim(),
      team_id: String(r.team_id ?? '').trim(),
      player_id: String(r.player_id ?? '').trim(),
      player_name: String(r.player_name ?? '').trim(),
      player_minutes: num(r.player_minutes) || 0,
      minute: num(r.minute) || 0,
      second: num(r.second) || 0,
      x: num(r.x), y: num(r.y),
      type: String(r.type ?? '').trim().toLowerCase(),
      outcome: String(r.outcome ?? '').trim().toLowerCase(),
      xg: num(r.xg),
    };
  }

  // distinct values for filter population
  function distinct(rows, key) {
    return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort();
  }

  // total minutes per player = sum of player_minutes taken ONCE per distinct match.
  // Chiave = player_name: nei dati il player_id e' unico PER PARTITA, quindi lo stesso
  // giocatore va riconosciuto per nome per non comparire duplicato.
  function totalMinutes(rows) {
    const seen = {}; // player_name -> { match_id -> minutes }
    for (const r of rows) {
      if (!seen[r.player_name]) seen[r.player_name] = {};
      if (seen[r.player_name][r.match_id] == null) seen[r.player_name][r.match_id] = r.player_minutes;
      else seen[r.player_name][r.match_id] = Math.max(seen[r.player_name][r.match_id], r.player_minutes);
    }
    const out = {};
    for (const pn in seen) out[pn] = Object.values(seen[pn]).reduce((a, b) => a + b, 0);
    return out;
  }

  function applyFilters(rows, f) {
    return rows.filter((r) => {
      if (f.competition && f.competition.length && !f.competition.includes(r.competition)) return false;
      if (f.season && f.season.length && !f.season.includes(r.season)) return false;
      if (f.team && f.team.length && !f.team.includes(r.team_id)) return false;
      return true;
    });
  }

  // build per-player aggregates from a (filtered) row set
  function aggregate(rows) {
    const mins = totalMinutes(rows);
    const byPlayer = {};
    for (const r of rows) {
      let p = byPlayer[r.player_name];
      if (!p) {
        p = byPlayer[r.player_name] = {
          player_id: r.player_name, player_name: r.player_name, team_id: r.team_id,
          minutes: mins[r.player_name] || 0,
          goals: 0, shots: 0, xg: 0,
          pass_total: 0, pass_complete: 0,
          tackle_total: 0, tackle_won: 0,
          dribble_total: 0, dribble_complete: 0,
          events: 0,
        };
      }
      p.events++;
      if (r.type === 'shot') {
        p.shots++; p.xg += r.xg || 0;
        if (r.outcome === 'goal') p.goals++;
      } else if (r.type === 'pass') {
        p.pass_total++; if (r.outcome === 'complete') p.pass_complete++;
      } else if (r.type === 'tackle') {
        p.tackle_total++; if (r.outcome === 'won') p.tackle_won++;
      } else if (r.type === 'dribble') {
        p.dribble_total++; if (r.outcome === 'complete') p.dribble_complete++;
      }
    }
    return Object.values(byPlayer).map((p) => ({
      ...p,
      g_xg: p.goals - p.xg,
      pass_pct: p.pass_total ? (p.pass_complete / p.pass_total) * 100 : null,
      tackle_pct: p.tackle_total ? (p.tackle_won / p.tackle_total) * 100 : null,
    }));
  }

  const COUNT_METRICS = new Set(['goals','shots','xg','g_xg','pass_complete','dribble_complete','dribbles','passes']);
  const PCT_METRICS = new Set(['pass_pct','tackle_pct']);

  // resolve a metric value for a player, applying per-90 to count metrics only
  function metricValue(p, metric, per90) {
    const raw = {
      goals: p.goals, xg: p.xg, g_xg: p.g_xg, shots: p.shots,
      passes: p.pass_complete, dribbles: p.dribble_complete,
      pass_pct: p.pass_pct, tackle_pct: p.tackle_pct,
    }[metric];
    if (raw == null) return null;
    if (per90 && !PCT_METRICS.has(metric)) {
      if (!p.minutes) return 0;
      return (raw * 90) / p.minutes;
    }
    return raw;
  }

  const METRICS = [
    { value: 'goals', label: 'Gol', fmt: (v) => v.toFixed(2), unit: '' },
    { value: 'xg', label: 'xG', fmt: (v) => v.toFixed(2), unit: '' },
    { value: 'g_xg', label: 'Gol − xG', fmt: (v) => (v > 0 ? '+' : '') + v.toFixed(2), unit: '' },
    { value: 'shots', label: 'Tiri', fmt: (v) => v.toFixed(2), unit: '' },
    { value: 'passes', label: 'Passaggi completati', fmt: (v) => v.toFixed(1), unit: '' },
    { value: 'pass_pct', label: '% passaggi riusciti', fmt: (v) => v.toFixed(1) + '%', unit: '%' },
    { value: 'tackle_pct', label: '% contrasti vinti', fmt: (v) => v.toFixed(1) + '%', unit: '%' },
    { value: 'dribbles', label: 'Dribbling riusciti', fmt: (v) => v.toFixed(1), unit: '' },
  ];

  window.VAData = { parseCsv, distinct, aggregate, applyFilters, metricValue, totalMinutes, METRICS, PCT_METRICS };
})();
