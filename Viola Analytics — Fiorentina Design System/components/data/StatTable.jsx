import React from 'react';

/**
 * StatTable — ordered numeric table for rankings.
 * columns: [{ key, label, align?, mono?, render?, accent? }]
 * rows: array of objects. Optional rank column, highlighted row, sort indicator.
 */
export function StatTable({ columns = [], rows = [], rank = true, highlightKey = null, sortKey = null, sortDir = 'desc', onSort, style = {} }) {
  return (
    <div style={{ width: '100%', overflowX: 'auto', ...style }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
        <thead>
          <tr>
            {rank && <th style={thStyle('center')} >#</th>}
            {columns.map((c) => (
              <th key={c.key}
                onClick={() => c.sortable !== false && onSort && onSort(c.key)}
                style={{ ...thStyle(c.align), cursor: c.sortable !== false && onSort ? 'pointer' : 'default', whiteSpace: 'nowrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {c.label}
                  {sortKey === c.key && <span style={{ color: 'var(--viola-600)', fontSize: 9 }}>{sortDir === 'desc' ? '▼' : '▲'}</span>}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const hot = highlightKey && row[highlightKey?.field ?? '__'] === highlightKey?.value;
            return (
              <tr key={i} style={{ background: hot ? 'var(--viola-50)' : 'transparent' }}>
                {rank && (
                  <td style={{ ...tdStyle('center'), color: i < 3 ? 'var(--viola-700)' : 'var(--text-muted)', fontWeight: i < 3 ? 700 : 500, fontFamily: 'var(--font-mono)' }}>
                    {i + 1}
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} style={{
                    ...tdStyle(c.align),
                    fontFamily: c.mono ? 'var(--font-mono)' : 'var(--font-body)',
                    fontVariantNumeric: c.mono ? 'tabular-nums' : 'normal',
                    color: c.accent ? 'var(--accent-600)' : c.muted ? 'var(--text-secondary)' : 'var(--text-primary)',
                    fontWeight: c.bold ? 600 : c.mono ? 500 : 400,
                  }}>
                    {c.render ? c.render(row[c.key], row) : row[c.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = (align = 'left') => ({
  textAlign: align, padding: '8px 12px', borderBottom: '1px solid var(--border-default)',
  font: 'var(--fw-semibold) var(--text-2xs) var(--font-body)', letterSpacing: '0.04em',
  textTransform: 'uppercase', color: 'var(--text-muted)', position: 'sticky', top: 0,
  background: 'var(--surface-card)',
});
const tdStyle = (align = 'left') => ({
  textAlign: align, padding: '9px 12px', borderBottom: '1px solid var(--border-subtle)',
  fontSize: 'var(--text-sm)',
});
