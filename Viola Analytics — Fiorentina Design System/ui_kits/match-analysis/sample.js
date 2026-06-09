/* ============================================================
   Viola Analytics — sample data generator (plain JS)
   window.VASample.generate() → normalized event rows (same shape
   as parsed CSV) so the dashboard renders populated by default.
   Deterministic (seeded) so previews are stable.
   ============================================================ */
(function () {
  // mulberry32 seeded RNG
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const SQUAD = [
    { id: 'p01', name: 'P. Terracciano', pos: 'GK',  attack: 0.02, finish: 1.00 },
    { id: 'p02', name: 'Dodô',           pos: 'RB',  attack: 0.35, finish: 0.95 },
    { id: 'p03', name: 'L. Ranieri',     pos: 'CB',  attack: 0.10, finish: 1.00 },
    { id: 'p04', name: 'M. Pongračić',   pos: 'CB',  attack: 0.12, finish: 1.05 },
    { id: 'p05', name: 'R. Gosens',      pos: 'LB',  attack: 0.45, finish: 1.10 },
    { id: 'p06', name: 'R. Mandragora',  pos: 'CM',  attack: 0.40, finish: 1.00 },
    { id: 'p07', name: 'Y. Adli',        pos: 'CM',  attack: 0.50, finish: 1.05 },
    { id: 'p08', name: 'D. Cataldi',     pos: 'CM',  attack: 0.35, finish: 0.90 },
    { id: 'p09', name: 'N. Fagioli',     pos: 'CM',  attack: 0.48, finish: 0.88 },
    { id: 'p10', name: 'A. Gudmundsson', pos: 'AM',  attack: 0.78, finish: 1.18 },
    { id: 'p11', name: 'R. Sottil',      pos: 'W',   attack: 0.74, finish: 1.22 },
    { id: 'p12', name: 'A. Colpani',     pos: 'AM',  attack: 0.70, finish: 0.96 },
    { id: 'p13', name: 'M. Kean',        pos: 'ST',  attack: 0.92, finish: 1.24 },
    { id: 'p14', name: 'L. Beltrán',     pos: 'ST',  attack: 0.80, finish: 0.82 },
  ];

  const COMPETITIONS = [
    { name: 'Serie A', season: '2025/26', matches: 12 },
    { name: 'Serie A', season: '2024/25', matches: 10 },
    { name: 'Coppa Italia', season: '2025/26', matches: 3 },
    { name: 'Conference League', season: '2025/26', matches: 5 },
  ];

  const TYPES = ['pass', 'shot', 'tackle', 'dribble', 'foul'];

  // non-goal shot outcomes only — goals are decided from xG × finishing skill
  function pickOutcome(type, r) {
    if (type === 'pass') return r < 0.82 ? 'complete' : 'incomplete';
    if (type === 'shot') {
      if (r < 0.42) return 'saved';
      if (r < 0.82) return 'off_target';
      return 'blocked';
    }
    if (type === 'tackle') return r < 0.62 ? 'won' : 'lost';
    if (type === 'dribble') return r < 0.58 ? 'complete' : 'incomplete';
    return 'conceded';
  }

  // event-type mix by attacking tendency (shots kept realistically scarce)
  function typeFor(player, r) {
    const a = player.attack;
    const wShot = 0.015 + a * 0.05;
    const wDribble = 0.02 + a * 0.08;
    const wTackle = 0.20 - a * 0.13;
    const wFoul = 0.045;
    const wPass = 1 - wShot - wDribble - wTackle - wFoul;
    const acc = [['pass', wPass], ['shot', wShot], ['dribble', wDribble], ['tackle', wTackle], ['foul', wFoul]];
    let c = 0;
    for (const [t, w] of acc) { c += w; if (r <= c) return t; }
    return 'pass';
  }

  function placeEvent(player, type, rnd) {
    const a = player.attack;
    let x, y;
    if (type === 'shot') {
      x = 60 + rnd() * 38;            // 60–98 — spread, not all from the 6-yard box
      y = 22 + rnd() * 56;            // central bias
    } else if (type === 'tackle' || type === 'foul') {
      x = 18 + a * 40 + rnd() * 25;
      y = 8 + rnd() * 84;
    } else {
      x = 20 + a * 50 + rnd() * 28;
      y = 6 + rnd() * 88;
    }
    return { x: Math.max(1, Math.min(99, x)), y: Math.max(1, Math.min(99, y)) };
  }

  function xgFor(x, y, rnd) {
    // closer to goal (high x) + central (mid y) → higher xG; tuned to avg ~0.11/shot
    const dx = (100 - x) / 100;
    const dy = Math.abs(y - 50) / 50;
    const dist = Math.sqrt(dx * dx * 1.5 + dy * dy * 1.0);
    let xg = 0.92 * Math.exp(-5.2 * dist);
    xg = xg * (0.7 + rnd() * 0.6);
    return Math.max(0.01, Math.min(0.95, xg));
  }

  function generate() {
    const rnd = rng(1926); // Forza Viola seed
    const rows = [];
    let matchSeq = 0;
    for (const comp of COMPETITIONS) {
      for (let m = 0; m < comp.matches; m++) {
        matchSeq++;
        const match_id = `M${String(matchSeq).padStart(3, '0')}`;
        const date = `2025-${String(1 + (matchSeq % 11)).padStart(2, '0')}-${String(1 + (matchSeq * 7) % 27).padStart(2, '0')}`;
        // choose 11–14 players who appeared, with minutes
        const lineup = SQUAD.filter(() => true);
        for (const player of lineup) {
          // not everyone plays every match
          if (rnd() < 0.18) continue;
          const starter = rnd() < 0.72;
          const minutes = starter ? 70 + Math.round(rnd() * 25) : Math.round(rnd() * 45);
          if (minutes < 4) continue;
          const baseEvents = Math.round((minutes / 90) * (player.pos === 'GK' ? 14 : 38) * (0.7 + rnd() * 0.6));
          for (let e = 0; e < baseEvents; e++) {
            const type = player.pos === 'GK' ? 'pass' : typeFor(player, rnd());
            const { x, y } = placeEvent(player, type, rnd);
            let outcome, xg = null;
            if (type === 'shot') {
              xg = +xgFor(x, y, rnd).toFixed(3);
              const goal = rnd() < Math.min(0.9, xg * player.finish);
              outcome = goal ? 'goal' : pickOutcome('shot', rnd());
            } else {
              outcome = pickOutcome(type, rnd());
            }
            rows.push({
              match_id, competition: comp.name, season: comp.season, match_date: date,
              team_id: 'FIO', player_id: player.id, player_name: player.name,
              player_minutes: minutes, minute: 1 + Math.floor(rnd() * (minutes || 90)),
              second: Math.floor(rnd() * 60),
              x: +x.toFixed(1), y: +y.toFixed(1), type, outcome, xg,
            });
          }
        }
      }
    }
    return rows;
  }

  // serialize rows back to a CSV string (for the "download esempio" affordance)
  function toCsv(rows) {
    const cols = ['match_id','competition','season','match_date','team_id','player_id','player_name','player_minutes','minute','second','x','y','type','outcome','xg'];
    const head = cols.join(',');
    const body = rows.map((r) => cols.map((c) => (r[c] == null ? '' : r[c])).join(',')).join('\n');
    return head + '\n' + body;
  }

  window.VASample = { generate, toCsv, SQUAD };
})();
