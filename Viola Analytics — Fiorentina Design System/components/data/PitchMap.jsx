import React from 'react';

const EVENT_COLORS = {
  pass: 'var(--ev-pass)', shot: 'var(--ev-shot)', tackle: 'var(--ev-tackle)',
  dribble: 'var(--ev-dribble)', foul: 'var(--ev-foul)',
};

/**
 * PitchMap — a drawn football pitch with events placed by x,y (0–100).
 * Color encodes event type; for shots, dot radius scales with xG.
 * x: 0 = own goal (left) → 100 = opponent goal (right).
 * Pure SVG, responsive via viewBox. `events` = [{x,y,type,outcome,xg}].
 */
export function PitchMap({ events = [], showStripes = true, height = 'auto', style = {} }) {
  const W = 1000, H = 660, M = 26; // viewBox + margin
  const fx = (x) => M + (x / 100) * (W - 2 * M);
  const fy = (y) => M + (y / 100) * (H - 2 * M);
  const line = 'var(--pitch-line)';
  const lw = 2.4;

  const [hover, setHover] = React.useState(null);

  // sort so shots (sized) render under smaller markers? keep input order; draw passes first
  const order = { pass: 0, dribble: 1, tackle: 2, foul: 3, shot: 4 };
  const sorted = [...events].sort((a, b) => (order[a.type] ?? 0) - (order[b.type] ?? 0));

  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} style={{ display: 'block', borderRadius: 'var(--radius-md)' }}>
        <defs>
          <clipPath id="vapitch"><rect x="0" y="0" width={W} height={H} rx="12" /></clipPath>
        </defs>
        <g clipPath="url(#vapitch)">
          {/* base */}
          <rect x="0" y="0" width={W} height={H} fill="var(--pitch-600)" />
          {/* mowing stripes (vertical) */}
          {showStripes && Array.from({ length: 10 }).map((_, i) => (
            <rect key={i} x={M + (i * (W - 2 * M)) / 10} y={M} width={(W - 2 * M) / 10} height={H - 2 * M}
              fill={i % 2 ? 'var(--pitch-grass-b)' : 'var(--pitch-grass-a)'} />
          ))}
          {/* giglio watermark — subtle easter egg */}
          <text x={W / 2} y={H / 2 + 18} textAnchor="middle" fontSize="240" fill="#ffffff" opacity="0.05"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700, pointerEvents: 'none' }}>⚜</text>
        </g>
        {/* outer boundary */}
        <rect x={M} y={M} width={W - 2 * M} height={H - 2 * M} fill="none" stroke={line} strokeWidth={lw} rx="3" />
        {/* halfway line + center circle */}
        <line x1={W / 2} y1={M} x2={W / 2} y2={H - M} stroke={line} strokeWidth={lw} />
        <circle cx={W / 2} cy={H / 2} r="78" fill="none" stroke={line} strokeWidth={lw} />
        <circle cx={W / 2} cy={H / 2} r="4" fill={line} />
        {/* penalty + goal areas (left & right) */}
        {[0, 1].map((side) => {
          const right = side === 1;
          const paW = 150, gaW = 56, paH = 322, gaH = 168;
          const x0 = right ? W - M - paW : M;
          const gx0 = right ? W - M - gaW : M;
          return (
            <g key={side}>
              <rect x={x0} y={(H - paH) / 2} width={paW} height={paH} fill="none" stroke={line} strokeWidth={lw} />
              <rect x={gx0} y={(H - gaH) / 2} width={gaW} height={gaH} fill="none" stroke={line} strokeWidth={lw} />
              <circle cx={right ? W - M - 100 : M + 100} cy={H / 2} r="3.5" fill={line} />
            </g>
          );
        })}
        {/* events */}
        {sorted.map((e, i) => {
          const c = EVENT_COLORS[e.type] || 'var(--gray-400)';
          const isShot = e.type === 'shot';
          const r = isShot ? 6 + Math.max(0, Math.min(1, Number(e.xg) || 0)) * 26 : 7;
          const goal = isShot && e.outcome === 'goal';
          return (
            <circle key={i} cx={fx(e.x)} cy={fy(e.y)} r={r}
              fill={c} fillOpacity={isShot ? 0.42 : 0.92}
              stroke={goal ? 'var(--white)' : c} strokeWidth={goal ? 3 : 1}
              onMouseEnter={() => setHover({ e, x: fx(e.x), y: fy(e.y) })}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer', transition: 'fill-opacity var(--dur-fast)' }} />
          );
        })}
        {/* direction arrow */}
        <g opacity="0.9">
          <line x1={W / 2 - 60} y1={H - 8} x2={W / 2 + 60} y2={H - 8} stroke="var(--white)" strokeWidth="2.5" />
          <polygon points={`${W / 2 + 60},${H - 8} ${W / 2 + 50},${H - 13} ${W / 2 + 50},${H - 3}`} fill="var(--white)" />
        </g>
      </svg>
      {hover && (
        <div style={{
          position: 'absolute', left: `${(hover.x / W) * 100}%`, top: `${(hover.y / H) * 100}%`,
          transform: 'translate(-50%, calc(-100% - 10px))', pointerEvents: 'none',
          background: 'var(--viola-900)', color: '#fff', padding: '6px 9px', borderRadius: 'var(--radius-sm)',
          font: 'var(--fw-medium) var(--text-xs) var(--font-body)', whiteSpace: 'nowrap', boxShadow: 'var(--shadow-lg)', zIndex: 5,
        }}>
          <b style={{ textTransform: 'capitalize' }}>{hover.e.type}</b> · {hover.e.outcome}
          {hover.e.type === 'shot' && hover.e.xg != null && (
            <span style={{ fontFamily: 'var(--font-mono)' }}> · xG {Number(hover.e.xg).toFixed(2)}</span>
          )}
        </div>
      )}
    </div>
  );
}
