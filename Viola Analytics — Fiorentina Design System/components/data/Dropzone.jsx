import React from 'react';

/**
 * Dropzone — drag & drop + "Scegli file" button for a CSV upload.
 * Calls onFile(file) when a file is dropped or chosen. Shows the active
 * filename + row hint when `fileName` is provided; an error banner when `error`.
 */
export function Dropzone({ onFile, fileName = null, rowCount = null, error = null, accept = '.csv', style = {} }) {
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef(null);

  const handleFiles = (files) => { if (files && files[0] && onFile) onFile(files[0]); };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current && inputRef.current.click()}
      role="button" tabIndex={0}
      style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px',
        border: `2px dashed ${error ? 'var(--danger-500)' : drag ? 'var(--viola-500)' : fileName ? 'var(--viola-300)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-lg)', cursor: 'pointer',
        background: drag ? 'var(--viola-50)' : error ? 'var(--danger-100)' : fileName ? 'var(--viola-50)' : 'var(--surface-card)',
        transition: 'all var(--dur-base) var(--ease-out)', ...style,
      }}
    >
      <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)} />
      <div style={{
        width: 44, height: 44, flex: 'none', borderRadius: 'var(--radius-md)',
        background: error ? 'var(--danger-500)' : 'var(--viola-600)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        boxShadow: 'var(--shadow-brand)',
      }}>{error ? '!' : fileName ? '✓' : '↑'}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {error ? (
          <>
            <div style={{ font: 'var(--fw-semibold) var(--text-sm) var(--font-body)', color: 'var(--danger-500)' }}>CSV non valido</div>
            <div style={{ font: 'var(--text-xs) var(--font-body)', color: 'var(--text-secondary)', marginTop: 2 }}>{error}</div>
          </>
        ) : fileName ? (
          <>
            <div style={{ font: 'var(--fw-semibold) var(--text-sm) var(--font-mono)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</div>
            <div style={{ font: 'var(--text-xs) var(--font-body)', color: 'var(--text-secondary)', marginTop: 2 }}>
              {rowCount != null ? `${rowCount.toLocaleString('it-IT')} eventi caricati · ` : ''}clicca o trascina per sostituire
            </div>
          </>
        ) : (
          <>
            <div style={{ font: 'var(--fw-semibold) var(--text-sm) var(--font-body)', color: 'var(--text-primary)' }}>
              Trascina qui il CSV degli eventi <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>o</span> scegli un file
            </div>
            <div style={{ font: 'var(--text-xs) var(--font-mono)', color: 'var(--text-muted)', marginTop: 3 }}>
              match_id, player_name, minute, x, y, type, outcome, xg…
            </div>
          </>
        )}
      </div>
      <span style={{
        flex: 'none', padding: '8px 14px', borderRadius: 'var(--radius-md)',
        background: 'var(--surface-card)', border: '1px solid var(--viola-300)',
        color: 'var(--viola-700)', font: 'var(--fw-semibold) var(--text-sm) var(--font-body)',
      }}>Scegli file</span>
    </div>
  );
}
