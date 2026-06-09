/* @ds-bundle: {"format":3,"namespace":"ViolaAnalyticsFiorentinaDesignSystem_48fef3","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Tooltip","sourcePath":"components/core/Tooltip.jsx"},{"name":"InfoDot","sourcePath":"components/core/Tooltip.jsx"},{"name":"Dropzone","sourcePath":"components/data/Dropzone.jsx"},{"name":"KpiCard","sourcePath":"components/data/KpiCard.jsx"},{"name":"Legend","sourcePath":"components/data/Legend.jsx"},{"name":"PitchMap","sourcePath":"components/data/PitchMap.jsx"},{"name":"StatTable","sourcePath":"components/data/StatTable.jsx"},{"name":"MetricSelector","sourcePath":"components/forms/MetricSelector.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Slider","sourcePath":"components/forms/Slider.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"7b648a493128","components/core/Button.jsx":"6cf3e3924d89","components/core/Card.jsx":"1844e5ee0d8e","components/core/Tooltip.jsx":"c914d42fe636","components/data/Dropzone.jsx":"a9ba66ab7c1a","components/data/KpiCard.jsx":"264fbb84404c","components/data/Legend.jsx":"ee126116007c","components/data/PitchMap.jsx":"382238bcc229","components/data/StatTable.jsx":"8aa6eab2c352","components/forms/MetricSelector.jsx":"34978ef4dab7","components/forms/Select.jsx":"b70076f57790","components/forms/Slider.jsx":"46cc4ded1f98","components/forms/Switch.jsx":"9a808a9c15b3","ui_kits/match-analysis/App.jsx":"6bb03f5a1183","ui_kits/match-analysis/data.js":"bc6b0934109d","ui_kits/match-analysis/sample.js":"bc5d6fbf5810","ui_kits/match-analysis/sections.jsx":"5c5109403e07"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ViolaAnalyticsFiorentinaDesignSystem_48fef3 = window.ViolaAnalyticsFiorentinaDesignSystem_48fef3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
/**
 * Badge — compact status / category label.
 * tone: neutral | viola | accent | positive | warning | danger | event
 * When tone="event", pass `eventType` (pass|shot|tackle|dribble|foul) to color it.
 */
function Badge({
  children,
  tone = 'neutral',
  eventType,
  dot = false,
  style = {}
}) {
  const tones = {
    neutral: {
      bg: 'var(--gray-100)',
      fg: 'var(--gray-700)',
      bd: 'var(--gray-200)'
    },
    viola: {
      bg: 'var(--viola-100)',
      fg: 'var(--viola-700)',
      bd: 'var(--viola-200)'
    },
    accent: {
      bg: 'var(--accent-soft)',
      fg: 'var(--accent-600)',
      bd: '#E6CCF7'
    },
    positive: {
      bg: 'var(--positive-100)',
      fg: '#0E7A47',
      bd: '#BCE6CF'
    },
    warning: {
      bg: 'var(--warning-100)',
      fg: '#9A6500',
      bd: '#F2DBA6'
    },
    danger: {
      bg: 'var(--danger-100)',
      fg: 'var(--danger-500)',
      bd: '#F3C4C1'
    }
  };
  const eventColors = {
    pass: 'var(--ev-pass)',
    shot: 'var(--ev-shot)',
    tackle: 'var(--ev-tackle)',
    dribble: 'var(--ev-dribble)',
    foul: 'var(--ev-foul)'
  };
  let t = tones[tone] || tones.neutral;
  let dotColor = t.fg;
  if (tone === 'event' && eventType) {
    const c = eventColors[eventType] || 'var(--gray-500)';
    t = {
      bg: 'var(--gray-100)',
      fg: 'var(--gray-700)',
      bd: 'var(--gray-200)'
    };
    dotColor = c;
  }
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: dot ? '3px 10px 3px 8px' : '3px 10px',
      background: t.bg,
      color: t.fg,
      border: `1px solid ${t.bd}`,
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      fontWeight: 600,
      letterSpacing: '0.01em',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
      ...style
    }
  }, (dot || tone === 'event') && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: dotColor,
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — primary action control for Viola Analytics.
 * Variants: primary (viola), secondary (outline), ghost, danger.
 * Sizes: sm | md | lg. Optional leading/trailing icon nodes.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const sizes = {
    sm: {
      height: 'var(--control-h-sm)',
      padding: '0 12px',
      font: '13px',
      radius: 'var(--radius-sm)',
      gap: '6px'
    },
    md: {
      height: 'var(--control-h-md)',
      padding: '0 16px',
      font: '14px',
      radius: 'var(--radius-md)',
      gap: '8px'
    },
    lg: {
      height: 'var(--control-h-lg)',
      padding: '0 22px',
      font: '15px',
      radius: 'var(--radius-md)',
      gap: '8px'
    }
  };
  const s = sizes[size] || sizes.md;
  const palettes = {
    primary: {
      bg: 'var(--viola-700)',
      bgHover: 'var(--viola-800)',
      color: 'var(--white)',
      border: 'transparent',
      shadow: 'var(--shadow-brand)'
    },
    secondary: {
      bg: 'var(--surface-card)',
      bgHover: 'var(--viola-50)',
      color: 'var(--viola-700)',
      border: 'var(--viola-300)',
      shadow: 'var(--shadow-xs)'
    },
    ghost: {
      bg: 'transparent',
      bgHover: 'var(--viola-50)',
      color: 'var(--viola-700)',
      border: 'transparent',
      shadow: 'none'
    },
    danger: {
      bg: 'var(--danger-500)',
      bgHover: '#c4271f',
      color: 'var(--white)',
      border: 'transparent',
      shadow: 'var(--shadow-sm)'
    }
  };
  const p = palettes[variant] || palettes.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      width: fullWidth ? '100%' : 'auto',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: s.font,
      letterSpacing: '0.01em',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      color: p.color,
      background: hover && !disabled ? p.bgHover : p.bg,
      border: `1px solid ${p.border}`,
      borderRadius: s.radius,
      boxShadow: variant === 'ghost' ? 'none' : p.shadow,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transform: active && !disabled ? 'translateY(1px) scale(0.99)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      fontSize: '1.1em'
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      fontSize: '1.1em'
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
/**
 * Card — surface container for dashboard panels.
 * Optional title + eyebrow + actions header. `pad` toggles inner padding.
 * `tone="brand"` renders the viola header treatment.
 */
function Card({
  title,
  eyebrow,
  actions = null,
  tone = 'default',
  pad = true,
  children,
  style = {}
}) {
  const brand = tone === 'brand';
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, (title || eyebrow || actions) && /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      padding: '14px 18px',
      background: brand ? 'var(--viola-700)' : 'transparent',
      borderBottom: brand ? 'none' : '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-bold) var(--text-2xs)/1.3 var(--font-body)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: brand ? 'var(--accent-300)' : 'var(--text-brand)',
      marginBottom: 3
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: 'var(--type-card-title)',
      color: brand ? 'var(--white)' : 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flex: 'none'
    }
  }, actions)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: pad ? '18px' : 0,
      flex: 1,
      minHeight: 0
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Tooltip.jsx
try { (() => {
/**
 * Tooltip — explains technical/calcistic terms on hover or focus.
 * Wraps any trigger; `label` is the explanatory text. `side` = top|bottom.
 * Designed for the "spiega ogni termine" requirement.
 */
function Tooltip({
  label,
  side = 'top',
  children,
  maxWidth = 240,
  style = {}
}) {
  const [open, setOpen] = React.useState(false);
  const pos = side === 'bottom' ? {
    top: 'calc(100% + 8px)',
    bottom: 'auto'
  } : {
    bottom: 'calc(100% + 8px)',
    top: 'auto'
  };
  const arrow = side === 'bottom' ? {
    top: -4,
    borderWidth: '0 5px 5px 5px',
    borderColor: 'transparent transparent var(--viola-900) transparent'
  } : {
    bottom: -4,
    borderWidth: '5px 5px 0 5px',
    borderColor: 'var(--viola-900) transparent transparent transparent'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    tabIndex: 0
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      ...pos,
      transform: `translateX(-50%) translateY(${open ? '0' : side === 'bottom' ? '-4px' : '4px'})`,
      background: 'var(--viola-900)',
      color: 'var(--white)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      lineHeight: 1.4,
      padding: '8px 11px',
      borderRadius: 'var(--radius-sm)',
      width: 'max-content',
      maxWidth,
      boxShadow: 'var(--shadow-lg)',
      opacity: open ? 1 : 0,
      pointerEvents: 'none',
      zIndex: 'var(--z-tooltip)',
      transition: 'opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)'
    }
  }, label, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      marginLeft: -5,
      width: 0,
      height: 0,
      borderStyle: 'solid',
      ...arrow
    }
  })));
}

/**
 * InfoDot — a small "?" affordance to attach a Tooltip to.
 */
function InfoDot({
  label,
  side = 'top'
}) {
  return /*#__PURE__*/React.createElement(Tooltip, {
    label: label,
    side: side
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 15,
      height: 15,
      borderRadius: '50%',
      cursor: 'help',
      background: 'var(--gray-200)',
      color: 'var(--gray-600)',
      fontFamily: 'var(--font-body)',
      fontSize: 10,
      fontWeight: 700
    }
  }, "?"));
}
Object.assign(__ds_scope, { Tooltip, InfoDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/data/Dropzone.jsx
try { (() => {
/**
 * Dropzone — drag & drop + "Scegli file" button for a CSV upload.
 * Calls onFile(file) when a file is dropped or chosen. Shows the active
 * filename + row hint when `fileName` is provided; an error banner when `error`.
 */
function Dropzone({
  onFile,
  fileName = null,
  rowCount = null,
  error = null,
  accept = '.csv',
  style = {}
}) {
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef(null);
  const handleFiles = files => {
    if (files && files[0] && onFile) onFile(files[0]);
  };
  return /*#__PURE__*/React.createElement("div", {
    onDragOver: e => {
      e.preventDefault();
      setDrag(true);
    },
    onDragLeave: () => setDrag(false),
    onDrop: e => {
      e.preventDefault();
      setDrag(false);
      handleFiles(e.dataTransfer.files);
    },
    onClick: () => inputRef.current && inputRef.current.click(),
    role: "button",
    tabIndex: 0,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 18px',
      border: `2px dashed ${error ? 'var(--danger-500)' : drag ? 'var(--viola-500)' : fileName ? 'var(--viola-300)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      background: drag ? 'var(--viola-50)' : error ? 'var(--danger-100)' : fileName ? 'var(--viola-50)' : 'var(--surface-card)',
      transition: 'all var(--dur-base) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "file",
    accept: accept,
    style: {
      display: 'none'
    },
    onChange: e => handleFiles(e.target.files)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      flex: 'none',
      borderRadius: 'var(--radius-md)',
      background: error ? 'var(--danger-500)' : 'var(--viola-600)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 22,
      boxShadow: 'var(--shadow-brand)'
    }
  }, error ? '!' : fileName ? '✓' : '↑'), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, error ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-semibold) var(--text-sm) var(--font-body)',
      color: 'var(--danger-500)'
    }
  }, "CSV non valido"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-xs) var(--font-body)',
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, error)) : fileName ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-semibold) var(--text-sm) var(--font-mono)',
      color: 'var(--text-primary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, fileName), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-xs) var(--font-body)',
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, rowCount != null ? `${rowCount.toLocaleString('it-IT')} eventi caricati · ` : '', "clicca o trascina per sostituire")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-semibold) var(--text-sm) var(--font-body)',
      color: 'var(--text-primary)'
    }
  }, "Trascina qui il CSV degli eventi ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontWeight: 400
    }
  }, "o"), " scegli un file"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-xs) var(--font-mono)',
      color: 'var(--text-muted)',
      marginTop: 3
    }
  }, "match_id, player_name, minute, x, y, type, outcome, xg\u2026"))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      padding: '8px 14px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-card)',
      border: '1px solid var(--viola-300)',
      color: 'var(--viola-700)',
      font: 'var(--fw-semibold) var(--text-sm) var(--font-body)'
    }
  }, "Scegli file"));
}
Object.assign(__ds_scope, { Dropzone });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Dropzone.jsx", error: String((e && e.message) || e) }); }

// components/data/KpiCard.jsx
try { (() => {
/**
 * KpiCard — single headline metric. Mono/display value, optional delta badge
 * and an InfoDot-style hint. Used in the player scorecard row.
 */
function KpiCard({
  label,
  value,
  unit = '',
  delta = null,
  deltaTone = 'auto',
  hint = null,
  accent = false,
  style = {}
}) {
  let tone = deltaTone;
  if (delta != null && deltaTone === 'auto') {
    const n = parseFloat(String(delta).replace(/[^\-0-9.]/g, ''));
    tone = n > 0 ? 'positive' : n < 0 ? 'danger' : 'neutral';
  }
  const deltaColors = {
    positive: {
      c: '#0E7A47',
      b: 'var(--positive-100)'
    },
    danger: {
      c: 'var(--danger-500)',
      b: 'var(--danger-100)'
    },
    neutral: {
      c: 'var(--gray-600)',
      b: 'var(--gray-100)'
    }
  };
  const dc = deltaColors[tone] || deltaColors.neutral;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: `1px solid ${accent ? 'var(--viola-200)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      boxShadow: 'var(--shadow-xs)',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      position: 'relative',
      minWidth: 0,
      ...(accent ? {
        background: 'linear-gradient(160deg, var(--viola-50), var(--surface-card))'
      } : {}),
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-semibold) var(--text-2xs) var(--font-body)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, label), hint), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-kpi)',
      color: accent ? 'var(--accent-600)' : 'var(--text-primary)',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: 'var(--ls-tight)'
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-medium) var(--text-sm) var(--font-body)',
      color: 'var(--text-muted)'
    }
  }, unit)), delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'flex-start',
      padding: '2px 8px',
      borderRadius: 'var(--radius-pill)',
      background: dc.b,
      color: dc.c,
      font: 'var(--fw-semibold) var(--text-xs) var(--font-mono)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, delta));
}
Object.assign(__ds_scope, { KpiCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/KpiCard.jsx", error: String((e && e.message) || e) }); }

// components/data/Legend.jsx
try { (() => {
const EVENTS = [{
  type: 'pass',
  label: 'Passaggio',
  color: 'var(--ev-pass)'
}, {
  type: 'shot',
  label: 'Tiro (dim. ∝ xG)',
  color: 'var(--ev-shot)'
}, {
  type: 'tackle',
  label: 'Contrasto',
  color: 'var(--ev-tackle)'
}, {
  type: 'dribble',
  label: 'Dribbling',
  color: 'var(--ev-dribble)'
}, {
  type: 'foul',
  label: 'Fallo',
  color: 'var(--ev-foul)'
}];

/**
 * Legend — event-type key for the pitch map.
 * `only` optionally limits which event types are shown.
 */
function Legend({
  only = null,
  style = {}
}) {
  const items = only ? EVENTS.filter(e => only.includes(e.type)) : EVENTS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px 16px',
      alignItems: 'center',
      ...style
    }
  }, items.map(e => /*#__PURE__*/React.createElement("span", {
    key: e.type,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 11,
      borderRadius: '50%',
      background: e.color,
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-medium) var(--text-xs) var(--font-body)',
      color: 'var(--text-secondary)'
    }
  }, e.label))));
}
Object.assign(__ds_scope, { Legend });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Legend.jsx", error: String((e && e.message) || e) }); }

// components/data/PitchMap.jsx
try { (() => {
const EVENT_COLORS = {
  pass: 'var(--ev-pass)',
  shot: 'var(--ev-shot)',
  tackle: 'var(--ev-tackle)',
  dribble: 'var(--ev-dribble)',
  foul: 'var(--ev-foul)'
};

/**
 * PitchMap — a drawn football pitch with events placed by x,y (0–100).
 * Color encodes event type; for shots, dot radius scales with xG.
 * x: 0 = own goal (left) → 100 = opponent goal (right).
 * Pure SVG, responsive via viewBox. `events` = [{x,y,type,outcome,xg}].
 */
function PitchMap({
  events = [],
  showStripes = true,
  height = 'auto',
  style = {}
}) {
  const W = 1000,
    H = 660,
    M = 26; // viewBox + margin
  const fx = x => M + x / 100 * (W - 2 * M);
  const fy = y => M + y / 100 * (H - 2 * M);
  const line = 'var(--pitch-line)';
  const lw = 2.4;
  const [hover, setHover] = React.useState(null);

  // sort so shots (sized) render under smaller markers? keep input order; draw passes first
  const order = {
    pass: 0,
    dribble: 1,
    tackle: 2,
    foul: 3,
    shot: 4
  };
  const sorted = [...events].sort((a, b) => (order[a.type] ?? 0) - (order[b.type] ?? 0));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    height: height,
    style: {
      display: 'block',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "vapitch"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: W,
    height: H,
    rx: "12"
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#vapitch)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: W,
    height: H,
    fill: "var(--pitch-600)"
  }), showStripes && Array.from({
    length: 10
  }).map((_, i) => /*#__PURE__*/React.createElement("rect", {
    key: i,
    x: M + i * (W - 2 * M) / 10,
    y: M,
    width: (W - 2 * M) / 10,
    height: H - 2 * M,
    fill: i % 2 ? 'var(--pitch-grass-b)' : 'var(--pitch-grass-a)'
  })), /*#__PURE__*/React.createElement("text", {
    x: W / 2,
    y: H / 2 + 18,
    textAnchor: "middle",
    fontSize: "240",
    fill: "#ffffff",
    opacity: "0.05",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      pointerEvents: 'none'
    }
  }, "\u269C")), /*#__PURE__*/React.createElement("rect", {
    x: M,
    y: M,
    width: W - 2 * M,
    height: H - 2 * M,
    fill: "none",
    stroke: line,
    strokeWidth: lw,
    rx: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: W / 2,
    y1: M,
    x2: W / 2,
    y2: H - M,
    stroke: line,
    strokeWidth: lw
  }), /*#__PURE__*/React.createElement("circle", {
    cx: W / 2,
    cy: H / 2,
    r: "78",
    fill: "none",
    stroke: line,
    strokeWidth: lw
  }), /*#__PURE__*/React.createElement("circle", {
    cx: W / 2,
    cy: H / 2,
    r: "4",
    fill: line
  }), [0, 1].map(side => {
    const right = side === 1;
    const paW = 150,
      gaW = 56,
      paH = 322,
      gaH = 168;
    const x0 = right ? W - M - paW : M;
    const gx0 = right ? W - M - gaW : M;
    return /*#__PURE__*/React.createElement("g", {
      key: side
    }, /*#__PURE__*/React.createElement("rect", {
      x: x0,
      y: (H - paH) / 2,
      width: paW,
      height: paH,
      fill: "none",
      stroke: line,
      strokeWidth: lw
    }), /*#__PURE__*/React.createElement("rect", {
      x: gx0,
      y: (H - gaH) / 2,
      width: gaW,
      height: gaH,
      fill: "none",
      stroke: line,
      strokeWidth: lw
    }), /*#__PURE__*/React.createElement("circle", {
      cx: right ? W - M - 100 : M + 100,
      cy: H / 2,
      r: "3.5",
      fill: line
    }));
  }), sorted.map((e, i) => {
    const c = EVENT_COLORS[e.type] || 'var(--gray-400)';
    const isShot = e.type === 'shot';
    const r = isShot ? 6 + Math.max(0, Math.min(1, Number(e.xg) || 0)) * 26 : 7;
    const goal = isShot && e.outcome === 'goal';
    return /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: fx(e.x),
      cy: fy(e.y),
      r: r,
      fill: c,
      fillOpacity: isShot ? 0.42 : 0.92,
      stroke: goal ? 'var(--white)' : c,
      strokeWidth: goal ? 3 : 1,
      onMouseEnter: () => setHover({
        e,
        x: fx(e.x),
        y: fy(e.y)
      }),
      onMouseLeave: () => setHover(null),
      style: {
        cursor: 'pointer',
        transition: 'fill-opacity var(--dur-fast)'
      }
    });
  }), /*#__PURE__*/React.createElement("g", {
    opacity: "0.9"
  }, /*#__PURE__*/React.createElement("line", {
    x1: W / 2 - 60,
    y1: H - 8,
    x2: W / 2 + 60,
    y2: H - 8,
    stroke: "var(--white)",
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: `${W / 2 + 60},${H - 8} ${W / 2 + 50},${H - 13} ${W / 2 + 50},${H - 3}`,
    fill: "var(--white)"
  }))), hover && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: `${hover.x / W * 100}%`,
      top: `${hover.y / H * 100}%`,
      transform: 'translate(-50%, calc(-100% - 10px))',
      pointerEvents: 'none',
      background: 'var(--viola-900)',
      color: '#fff',
      padding: '6px 9px',
      borderRadius: 'var(--radius-sm)',
      font: 'var(--fw-medium) var(--text-xs) var(--font-body)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      textTransform: 'capitalize'
    }
  }, hover.e.type), " \xB7 ", hover.e.outcome, hover.e.type === 'shot' && hover.e.xg != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, " \xB7 xG ", Number(hover.e.xg).toFixed(2))));
}
Object.assign(__ds_scope, { PitchMap });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/PitchMap.jsx", error: String((e && e.message) || e) }); }

// components/data/StatTable.jsx
try { (() => {
/**
 * StatTable — ordered numeric table for rankings.
 * columns: [{ key, label, align?, mono?, render?, accent? }]
 * rows: array of objects. Optional rank column, highlighted row, sort indicator.
 */
function StatTable({
  columns = [],
  rows = [],
  rank = true,
  highlightKey = null,
  sortKey = null,
  sortDir = 'desc',
  onSort,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      overflowX: 'auto',
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, rank && /*#__PURE__*/React.createElement("th", {
    style: thStyle('center')
  }, "#"), columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    onClick: () => c.sortable !== false && onSort && onSort(c.key),
    style: {
      ...thStyle(c.align),
      cursor: c.sortable !== false && onSort ? 'pointer' : 'default',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, c.label, sortKey === c.key && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--viola-600)',
      fontSize: 9
    }
  }, sortDir === 'desc' ? '▼' : '▲')))))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, i) => {
    const hot = highlightKey && row[highlightKey?.field ?? '__'] === highlightKey?.value;
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        background: hot ? 'var(--viola-50)' : 'transparent'
      }
    }, rank && /*#__PURE__*/React.createElement("td", {
      style: {
        ...tdStyle('center'),
        color: i < 3 ? 'var(--viola-700)' : 'var(--text-muted)',
        fontWeight: i < 3 ? 700 : 500,
        fontFamily: 'var(--font-mono)'
      }
    }, i + 1), columns.map(c => /*#__PURE__*/React.createElement("td", {
      key: c.key,
      style: {
        ...tdStyle(c.align),
        fontFamily: c.mono ? 'var(--font-mono)' : 'var(--font-body)',
        fontVariantNumeric: c.mono ? 'tabular-nums' : 'normal',
        color: c.accent ? 'var(--accent-600)' : c.muted ? 'var(--text-secondary)' : 'var(--text-primary)',
        fontWeight: c.bold ? 600 : c.mono ? 500 : 400
      }
    }, c.render ? c.render(row[c.key], row) : row[c.key])));
  }))));
}
const thStyle = (align = 'left') => ({
  textAlign: align,
  padding: '8px 12px',
  borderBottom: '1px solid var(--border-default)',
  font: 'var(--fw-semibold) var(--text-2xs) var(--font-body)',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  position: 'sticky',
  top: 0,
  background: 'var(--surface-card)'
});
const tdStyle = (align = 'left') => ({
  textAlign: align,
  padding: '9px 12px',
  borderBottom: '1px solid var(--border-subtle)',
  fontSize: 'var(--text-sm)'
});
Object.assign(__ds_scope, { StatTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatTable.jsx", error: String((e && e.message) || e) }); }

// components/forms/MetricSelector.jsx
try { (() => {
/**
 * MetricSelector — segmented pill control to choose the active metric
 * for the ranking chart (Gol, xG, Gol−xG, Tiri, % passaggi, …).
 * Wraps to multiple rows. Controlled via value/onChange.
 */
function MetricSelector({
  options = [],
  value,
  onChange,
  style = {}
}) {
  const norm = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      ...style
    },
    role: "tablist"
  }, norm.map(o => {
    const on = value === o.value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      type: "button",
      role: "tab",
      "aria-selected": on,
      onClick: () => onChange && onChange(o.value),
      style: {
        padding: '7px 13px',
        borderRadius: 'var(--radius-pill)',
        border: `1px solid ${on ? 'var(--viola-600)' : 'var(--border-default)'}`,
        background: on ? 'var(--viola-600)' : 'var(--surface-card)',
        color: on ? 'var(--white)' : 'var(--text-secondary)',
        font: `${on ? 'var(--fw-semibold)' : 'var(--fw-medium)'} var(--text-sm) var(--font-body)`,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        boxShadow: on ? 'var(--shadow-brand)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-out)'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.borderColor = 'var(--viola-300)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.borderColor = 'var(--border-default)';
      }
    }, o.label);
  }));
}
Object.assign(__ds_scope, { MetricSelector });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/MetricSelector.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
/**
 * Select — single or multi select, populated from CSV-derived values.
 * options: array of strings OR { value, label }. Multi shows a checkbox menu
 * with a "n selezionati" summary chip. Closes on outside click.
 */
function Select({
  options = [],
  value,
  onChange,
  multi = false,
  placeholder = 'Seleziona…',
  label,
  disabled = false,
  style = {}
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const norm = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  React.useEffect(() => {
    const h = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const selected = multi ? Array.isArray(value) ? value : [] : value;
  const toggle = v => {
    if (multi) {
      const set = new Set(selected);
      set.has(v) ? set.delete(v) : set.add(v);
      onChange && onChange([...set]);
    } else {
      onChange && onChange(v);
      setOpen(false);
    }
  };
  let summary = placeholder;
  if (multi && selected.length) summary = selected.length === norm.length ? 'Tutte' : `${selected.length} selezionate`;else if (!multi && value) summary = norm.find(o => o.value === value)?.label ?? value;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-medium) var(--text-sm) var(--font-body)',
      color: 'var(--text-secondary)',
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    onClick: () => !disabled && setOpen(o => !o),
    style: {
      width: '100%',
      height: 'var(--control-h-md)',
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      background: 'var(--surface-card)',
      border: `1px solid ${open ? 'var(--viola-400)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      font: 'var(--fw-medium) var(--text-sm) var(--font-body)',
      color: (multi ? selected.length : value) ? 'var(--text-primary)' : 'var(--text-muted)',
      boxShadow: open ? 'var(--focus-ring)' : 'var(--shadow-xs)',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, summary), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--dur-fast)'
    }
  }, "\u25BE")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      left: 0,
      right: 0,
      zIndex: 'var(--z-overlay)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      padding: 5,
      maxHeight: 248,
      overflowY: 'auto'
    }
  }, norm.map(o => {
    const on = multi ? selected.includes(o.value) : value === o.value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      type: "button",
      onClick: () => toggle(o.value),
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '8px 9px',
        background: on && !multi ? 'var(--viola-50)' : 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        textAlign: 'left',
        font: 'var(--fw-medium) var(--text-sm) var(--font-body)',
        color: 'var(--text-primary)'
      },
      onMouseEnter: e => {
        if (!(on && !multi)) e.currentTarget.style.background = 'var(--gray-100)';
      },
      onMouseLeave: e => {
        if (!(on && !multi)) e.currentTarget.style.background = 'transparent';
      }
    }, multi && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        flex: 'none',
        borderRadius: 4,
        border: `1.5px solid ${on ? 'var(--viola-600)' : 'var(--border-strong)'}`,
        background: on ? 'var(--viola-600)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 11,
        fontWeight: 700
      }
    }, on ? '✓' : ''), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, o.label), !multi && on && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--viola-600)'
      }
    }, "\u2713"));
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Slider.jsx
try { (() => {
/**
 * Slider — single-value range control (e.g. "Top N", "minuti minimi").
 * Viola track fill, mono value readout. Controlled via value/onChange.
 */
function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  suffix = '',
  showValue = true,
  disabled = false,
  style = {}
}) {
  const pct = (value - min) / (max - min) * 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 8
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-medium) var(--text-sm) var(--font-body)',
      color: 'var(--text-secondary)'
    }
  }, label), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-semibold) var(--text-sm) var(--font-mono)',
      color: 'var(--accent-600)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value, suffix)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: min,
    max: max,
    step: step,
    value: value,
    disabled: disabled,
    onChange: e => onChange && onChange(Number(e.target.value)),
    style: {
      width: '100%',
      height: 6,
      appearance: 'none',
      WebkitAppearance: 'none',
      borderRadius: 'var(--radius-pill)',
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: `linear-gradient(to right, var(--viola-600) 0%, var(--viola-600) ${pct}%, var(--gray-200) ${pct}%, var(--gray-200) 100%)`
    },
    className: "va-slider"
  }), /*#__PURE__*/React.createElement("style", null, `
        .va-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:50%; background:var(--white); border:3px solid var(--viola-600); box-shadow:var(--shadow-sm); cursor:pointer; transition: transform var(--dur-fast) var(--ease-out); }
        .va-slider::-webkit-slider-thumb:hover { transform: scale(1.12); }
        .va-slider::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:var(--white); border:3px solid var(--viola-600); box-shadow:var(--shadow-sm); cursor:pointer; }
      `));
}
Object.assign(__ds_scope, { Slider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Slider.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/**
 * Switch — boolean toggle (e.g. "Normalizza per 90′").
 * Optional label + hint text. Controlled via checked/onChange.
 */
function Switch({
  checked,
  onChange,
  label,
  hint,
  disabled = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: hint ? 'flex-start' : 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      flex: 'none',
      width: 40,
      height: 23,
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      padding: 2,
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: checked ? 'var(--viola-600)' : 'var(--gray-300)',
      transition: 'background var(--dur-base) var(--ease-out)',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 19,
      height: 19,
      borderRadius: '50%',
      background: 'var(--white)',
      boxShadow: 'var(--shadow-sm)',
      transform: checked ? 'translateX(17px)' : 'translateX(0)',
      transition: 'transform var(--dur-base) var(--ease-spring)'
    }
  })), (label || hint) && /*#__PURE__*/React.createElement("span", null, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--fw-medium) var(--text-sm) var(--font-body)',
      color: 'var(--text-primary)'
    }
  }, label), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--text-xs) var(--font-body)',
      color: 'var(--text-muted)',
      marginTop: 2,
      lineHeight: 1.4
    }
  }, hint)));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/match-analysis/App.jsx
try { (() => {
/* Viola Analytics — main app orchestrator */
const VANS_APP = window.ViolaAnalyticsFiorentinaDesignSystem_48fef3;
function App() {
  const {
    Dropzone
  } = VANS_APP;
  const [rows, setRows] = React.useState(null);
  const [fileName, setFileName] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [filters, setFilters] = React.useState({
    competition: [],
    season: [],
    team: [],
    minMinutes: 0,
    per90: false
  });
  const [metric, setMetric] = React.useState('goals');
  const [topN, setTopN] = React.useState(10);
  const [selected, setSelected] = React.useState(null);
  const setF = patch => setFilters(f => ({
    ...f,
    ...patch
  }));

  /* ---- ingest ---- */
  const ingest = React.useCallback((newRows, name) => {
    setRows(newRows);
    setFileName(name);
    setError(null);
    setFilters(f => ({
      ...f,
      competition: [],
      season: [],
      team: [],
      minMinutes: 0
    }));
    setSelected(null);
  }, []);
  const handleFile = React.useCallback(file => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = window.VAData.parseCsv(String(e.target.result));
        ingest(parsed, file.name);
      } catch (err) {
        setError(err.message || 'File non leggibile.');
        setRows(null);
        setFileName(null);
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
    if (!rows) return {
      competitions: [],
      seasons: [],
      teams: []
    };
    return {
      competitions: window.VAData.distinct(rows, 'competition'),
      seasons: window.VAData.distinct(rows, 'season'),
      teams: window.VAData.distinct(rows, 'team_id')
    };
  }, [rows]);
  const filteredRows = React.useMemo(() => rows ? window.VAData.applyFilters(rows, filters) : [], [rows, filters]);
  const maxMinutes = React.useMemo(() => {
    if (!rows) return 3000;
    const mins = window.VAData.totalMinutes(rows);
    return Math.max(90, Math.ceil(Math.max(...Object.values(mins)) / 90) * 90);
  }, [rows]);
  const aggregates = React.useMemo(() => {
    if (!filteredRows.length) return [];
    return window.VAData.aggregate(filteredRows).filter(p => p.minutes >= filters.minMinutes);
  }, [filteredRows, filters.minMinutes]);
  const ranking = React.useMemo(() => {
    const withVal = aggregates.map(p => ({
      ...p,
      metricVal: window.VAData.metricValue(p, metric, filters.per90)
    })).filter(p => p.metricVal != null).sort((a, b) => b.metricVal - a.metricVal);
    const out = withVal.slice(0, topN);
    out._total = withVal.length;
    return out;
  }, [aggregates, metric, filters.per90, topN]);
  const playerOptions = React.useMemo(() => aggregates.slice().sort((a, b) => a.player_name.localeCompare(b.player_name)).map(p => ({
    value: p.player_id,
    label: p.player_name
  })), [aggregates]);

  // keep a valid selection
  React.useEffect(() => {
    if (!aggregates.length) {
      if (selected) setSelected(null);
      return;
    }
    if (!selected || !aggregates.find(p => p.player_id === selected)) {
      // default to current ranking leader
      setSelected(ranking[0] && ranking[0].player_id || aggregates[0].player_id);
    }
  }, [aggregates, ranking, selected]);
  const selectedStat = React.useMemo(() => aggregates.find(p => p.player_id === selected) || null, [aggregates, selected]);
  const selectedEvents = React.useMemo(() => selected ? filteredRows.filter(r => r.player_id === selected && r.x != null && r.y != null).map(r => ({
    x: r.x,
    y: r.y,
    type: r.type,
    outcome: r.outcome,
    xg: r.xg
  })) : [], [filteredRows, selected]);
  const hasData = !!rows;
  return /*#__PURE__*/React.createElement("div", {
    className: "va-app"
  }, /*#__PURE__*/React.createElement(Header, {
    fileName: fileName,
    eventCount: rows ? rows.length : 0,
    onLoadSample: loadSample
  }), /*#__PURE__*/React.createElement("div", {
    className: "va-upload"
  }, /*#__PURE__*/React.createElement(Dropzone, {
    onFile: handleFile,
    fileName: fileName,
    rowCount: rows ? rows.length : null,
    error: error
  })), !hasData && /*#__PURE__*/React.createElement(EmptyState, {
    onLoadSample: loadSample
  }), hasData && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FilterBar, {
    options: options,
    filters: filters,
    set: setF,
    maxMinutes: maxMinutes
  }), aggregates.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "va-noresult"
  }, "Nessun giocatore supera i filtri attuali. Abbassa i \xABminuti minimi\xBB o allarga la selezione.") : /*#__PURE__*/React.createElement("div", {
    className: "va-grid"
  }, /*#__PURE__*/React.createElement(RankingSection, {
    ranking: ranking,
    metric: metric,
    setMetric: setMetric,
    topN: topN,
    setTopN: setTopN,
    per90: filters.per90,
    onPick: setSelected,
    selected: selected
  }), /*#__PURE__*/React.createElement(PlayerSection, {
    players: playerOptions,
    selected: selected,
    onSelect: setSelected,
    stat: selectedStat,
    events: selectedEvents,
    per90: filters.per90
  }))), /*#__PURE__*/React.createElement("footer", {
    className: "va-foot mono"
  }, "Viola Analytics \xB7 tutto in memoria, nessun dato lascia il browser \xB7", /*#__PURE__*/React.createElement("span", {
    className: "va-foot-egg",
    title: "Forza Viola dal 1926"
  }, " \u269C 1926")));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/match-analysis/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/match-analysis/data.js
try { (() => {
/* ============================================================
   Viola Analytics — data layer (plain JS, no JSX)
   Exposes window.VAData: CSV parsing + aggregation.
   Depends on global Papa (PapaParse).
   ============================================================ */
(function () {
  const REQUIRED = ['match_id', 'player_id', 'player_name', 'player_minutes', 'minute', 'x', 'y', 'type', 'outcome', 'xg'];
  function parseCsv(text) {
    const res = Papa.parse(text.trim(), {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false
    });
    if (res.errors && res.errors.length) {
      const e = res.errors[0];
      throw new Error(`Riga ${(e.row ?? 0) + 1}: ${e.message}`);
    }
    const cols = res.meta.fields || [];
    const missing = REQUIRED.filter(c => !cols.includes(c));
    if (missing.length) throw new Error(`Colonne mancanti: ${missing.join(', ')}`);
    const rows = res.data.map(normalizeRow).filter(r => r.type);
    if (!rows.length) throw new Error('Nessun evento valido trovato nel file.');
    return rows;
  }
  function normalizeRow(r) {
    const num = v => v === '' || v == null ? null : Number(v);
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
      x: num(r.x),
      y: num(r.y),
      type: String(r.type ?? '').trim().toLowerCase(),
      outcome: String(r.outcome ?? '').trim().toLowerCase(),
      xg: num(r.xg)
    };
  }

  // distinct values for filter population
  function distinct(rows, key) {
    return [...new Set(rows.map(r => r[key]).filter(Boolean))].sort();
  }

  // total minutes per player = sum of player_minutes taken ONCE per distinct match
  function totalMinutes(rows) {
    const seen = {}; // player_id -> { match_id -> minutes }
    for (const r of rows) {
      if (!seen[r.player_id]) seen[r.player_id] = {};
      if (seen[r.player_id][r.match_id] == null) seen[r.player_id][r.match_id] = r.player_minutes;else seen[r.player_id][r.match_id] = Math.max(seen[r.player_id][r.match_id], r.player_minutes);
    }
    const out = {};
    for (const pid in seen) out[pid] = Object.values(seen[pid]).reduce((a, b) => a + b, 0);
    return out;
  }
  function applyFilters(rows, f) {
    return rows.filter(r => {
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
      let p = byPlayer[r.player_id];
      if (!p) {
        p = byPlayer[r.player_id] = {
          player_id: r.player_id,
          player_name: r.player_name,
          team_id: r.team_id,
          minutes: mins[r.player_id] || 0,
          goals: 0,
          shots: 0,
          xg: 0,
          pass_total: 0,
          pass_complete: 0,
          tackle_total: 0,
          tackle_won: 0,
          dribble_total: 0,
          dribble_complete: 0,
          events: 0
        };
      }
      p.events++;
      if (r.type === 'shot') {
        p.shots++;
        p.xg += r.xg || 0;
        if (r.outcome === 'goal') p.goals++;
      } else if (r.type === 'pass') {
        p.pass_total++;
        if (r.outcome === 'complete') p.pass_complete++;
      } else if (r.type === 'tackle') {
        p.tackle_total++;
        if (r.outcome === 'won') p.tackle_won++;
      } else if (r.type === 'dribble') {
        p.dribble_total++;
        if (r.outcome === 'complete') p.dribble_complete++;
      }
    }
    return Object.values(byPlayer).map(p => ({
      ...p,
      g_xg: p.goals - p.xg,
      pass_pct: p.pass_total ? p.pass_complete / p.pass_total * 100 : null,
      tackle_pct: p.tackle_total ? p.tackle_won / p.tackle_total * 100 : null
    }));
  }
  const COUNT_METRICS = new Set(['goals', 'shots', 'xg', 'g_xg', 'pass_complete', 'dribble_complete', 'dribbles', 'passes']);
  const PCT_METRICS = new Set(['pass_pct', 'tackle_pct']);

  // resolve a metric value for a player, applying per-90 to count metrics only
  function metricValue(p, metric, per90) {
    const raw = {
      goals: p.goals,
      xg: p.xg,
      g_xg: p.g_xg,
      shots: p.shots,
      passes: p.pass_complete,
      dribbles: p.dribble_complete,
      pass_pct: p.pass_pct,
      tackle_pct: p.tackle_pct
    }[metric];
    if (raw == null) return null;
    if (per90 && !PCT_METRICS.has(metric)) {
      if (!p.minutes) return 0;
      return raw * 90 / p.minutes;
    }
    return raw;
  }
  const METRICS = [{
    value: 'goals',
    label: 'Gol',
    fmt: v => v.toFixed(2),
    unit: ''
  }, {
    value: 'xg',
    label: 'xG',
    fmt: v => v.toFixed(2),
    unit: ''
  }, {
    value: 'g_xg',
    label: 'Gol − xG',
    fmt: v => (v > 0 ? '+' : '') + v.toFixed(2),
    unit: ''
  }, {
    value: 'shots',
    label: 'Tiri',
    fmt: v => v.toFixed(2),
    unit: ''
  }, {
    value: 'passes',
    label: 'Passaggi completati',
    fmt: v => v.toFixed(1),
    unit: ''
  }, {
    value: 'pass_pct',
    label: '% passaggi riusciti',
    fmt: v => v.toFixed(1) + '%',
    unit: '%'
  }, {
    value: 'tackle_pct',
    label: '% contrasti vinti',
    fmt: v => v.toFixed(1) + '%',
    unit: '%'
  }, {
    value: 'dribbles',
    label: 'Dribbling riusciti',
    fmt: v => v.toFixed(1),
    unit: ''
  }];
  window.VAData = {
    parseCsv,
    distinct,
    aggregate,
    applyFilters,
    metricValue,
    totalMinutes,
    METRICS,
    PCT_METRICS
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/match-analysis/data.js", error: String((e && e.message) || e) }); }

// ui_kits/match-analysis/sample.js
try { (() => {
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
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const SQUAD = [{
    id: 'p01',
    name: 'P. Terracciano',
    pos: 'GK',
    attack: 0.02,
    finish: 1.00
  }, {
    id: 'p02',
    name: 'Dodô',
    pos: 'RB',
    attack: 0.35,
    finish: 0.95
  }, {
    id: 'p03',
    name: 'L. Ranieri',
    pos: 'CB',
    attack: 0.10,
    finish: 1.00
  }, {
    id: 'p04',
    name: 'M. Pongračić',
    pos: 'CB',
    attack: 0.12,
    finish: 1.05
  }, {
    id: 'p05',
    name: 'R. Gosens',
    pos: 'LB',
    attack: 0.45,
    finish: 1.10
  }, {
    id: 'p06',
    name: 'R. Mandragora',
    pos: 'CM',
    attack: 0.40,
    finish: 1.00
  }, {
    id: 'p07',
    name: 'Y. Adli',
    pos: 'CM',
    attack: 0.50,
    finish: 1.05
  }, {
    id: 'p08',
    name: 'D. Cataldi',
    pos: 'CM',
    attack: 0.35,
    finish: 0.90
  }, {
    id: 'p09',
    name: 'N. Fagioli',
    pos: 'CM',
    attack: 0.48,
    finish: 0.88
  }, {
    id: 'p10',
    name: 'A. Gudmundsson',
    pos: 'AM',
    attack: 0.78,
    finish: 1.18
  }, {
    id: 'p11',
    name: 'R. Sottil',
    pos: 'W',
    attack: 0.74,
    finish: 1.22
  }, {
    id: 'p12',
    name: 'A. Colpani',
    pos: 'AM',
    attack: 0.70,
    finish: 0.96
  }, {
    id: 'p13',
    name: 'M. Kean',
    pos: 'ST',
    attack: 0.92,
    finish: 1.24
  }, {
    id: 'p14',
    name: 'L. Beltrán',
    pos: 'ST',
    attack: 0.80,
    finish: 0.82
  }];
  const COMPETITIONS = [{
    name: 'Serie A',
    season: '2025/26',
    matches: 12
  }, {
    name: 'Serie A',
    season: '2024/25',
    matches: 10
  }, {
    name: 'Coppa Italia',
    season: '2025/26',
    matches: 3
  }, {
    name: 'Conference League',
    season: '2025/26',
    matches: 5
  }];
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
    for (const [t, w] of acc) {
      c += w;
      if (r <= c) return t;
    }
    return 'pass';
  }
  function placeEvent(player, type, rnd) {
    const a = player.attack;
    let x, y;
    if (type === 'shot') {
      x = 60 + rnd() * 38; // 60–98 — spread, not all from the 6-yard box
      y = 22 + rnd() * 56; // central bias
    } else if (type === 'tackle' || type === 'foul') {
      x = 18 + a * 40 + rnd() * 25;
      y = 8 + rnd() * 84;
    } else {
      x = 20 + a * 50 + rnd() * 28;
      y = 6 + rnd() * 88;
    }
    return {
      x: Math.max(1, Math.min(99, x)),
      y: Math.max(1, Math.min(99, y))
    };
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
        const date = `2025-${String(1 + matchSeq % 11).padStart(2, '0')}-${String(1 + matchSeq * 7 % 27).padStart(2, '0')}`;
        // choose 11–14 players who appeared, with minutes
        const lineup = SQUAD.filter(() => true);
        for (const player of lineup) {
          // not everyone plays every match
          if (rnd() < 0.18) continue;
          const starter = rnd() < 0.72;
          const minutes = starter ? 70 + Math.round(rnd() * 25) : Math.round(rnd() * 45);
          if (minutes < 4) continue;
          const baseEvents = Math.round(minutes / 90 * (player.pos === 'GK' ? 14 : 38) * (0.7 + rnd() * 0.6));
          for (let e = 0; e < baseEvents; e++) {
            const type = player.pos === 'GK' ? 'pass' : typeFor(player, rnd());
            const {
              x,
              y
            } = placeEvent(player, type, rnd);
            let outcome,
              xg = null;
            if (type === 'shot') {
              xg = +xgFor(x, y, rnd).toFixed(3);
              const goal = rnd() < Math.min(0.9, xg * player.finish);
              outcome = goal ? 'goal' : pickOutcome('shot', rnd());
            } else {
              outcome = pickOutcome(type, rnd());
            }
            rows.push({
              match_id,
              competition: comp.name,
              season: comp.season,
              match_date: date,
              team_id: 'FIO',
              player_id: player.id,
              player_name: player.name,
              player_minutes: minutes,
              minute: 1 + Math.floor(rnd() * (minutes || 90)),
              second: Math.floor(rnd() * 60),
              x: +x.toFixed(1),
              y: +y.toFixed(1),
              type,
              outcome,
              xg
            });
          }
        }
      }
    }
    return rows;
  }

  // serialize rows back to a CSV string (for the "download esempio" affordance)
  function toCsv(rows) {
    const cols = ['match_id', 'competition', 'season', 'match_date', 'team_id', 'player_id', 'player_name', 'player_minutes', 'minute', 'second', 'x', 'y', 'type', 'outcome', 'xg'];
    const head = cols.join(',');
    const body = rows.map(r => cols.map(c => r[c] == null ? '' : r[c]).join(',')).join('\n');
    return head + '\n' + body;
  }
  window.VASample = {
    generate,
    toCsv,
    SQUAD
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/match-analysis/sample.js", error: String((e && e.message) || e) }); }

// ui_kits/match-analysis/sections.jsx
try { (() => {
/* Viola Analytics dashboard — sections. Exports to window. */
const VANS = window.ViolaAnalyticsFiorentinaDesignSystem_48fef3;

/* ---------- Header (with easter eggs) ---------------------- */
function Header({
  fileName,
  eventCount,
  onLoadSample
}) {
  const ballRef = React.useRef(null);
  const spin = () => {
    const b = ballRef.current;
    if (!b) return;
    b.classList.remove('go');
    void b.offsetWidth;
    b.classList.add('go');
  };
  return /*#__PURE__*/React.createElement("header", {
    className: "va-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "va-brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "va-crest-wrap",
    onClick: spin,
    title: "Fondata nel 1926 \xB7 Forza Viola"
  }, /*#__PURE__*/React.createElement("img", {
    className: "va-crest",
    src: "../../assets/fiorentina-crest.png",
    alt: "ACF Fiorentina"
  }), /*#__PURE__*/React.createElement("span", {
    className: "va-ball",
    ref: ballRef
  }, "\u26BD"), /*#__PURE__*/React.createElement("span", {
    className: "va-1926"
  }, "EST. 1926")), /*#__PURE__*/React.createElement("div", {
    className: "va-word"
  }, /*#__PURE__*/React.createElement("div", {
    className: "va-word-v"
  }, "Viola ", /*#__PURE__*/React.createElement("span", null, "Analytics")), /*#__PURE__*/React.createElement("div", {
    className: "va-word-a"
  }, "Match Analysis \xB7 Data Engineering Desk"))), /*#__PURE__*/React.createElement("div", {
    className: "va-headmeta"
  }, fileName ? /*#__PURE__*/React.createElement("div", {
    className: "va-pill-file"
  }, /*#__PURE__*/React.createElement("span", {
    className: "va-dot-live"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, fileName), /*#__PURE__*/React.createElement("span", {
    className: "va-sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, eventCount.toLocaleString('it-IT'), " eventi")) : /*#__PURE__*/React.createElement(VANS.Button, {
    variant: "secondary",
    size: "sm",
    onClick: onLoadSample
  }, "Carica dataset d'esempio")));
}

/* ---------- Empty state ------------------------------------ */
function EmptyState({
  onLoadSample
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "va-empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "va-empty-icon"
  }, "\u26BD"), /*#__PURE__*/React.createElement("h2", null, "Carica un CSV per iniziare l'analisi"), /*#__PURE__*/React.createElement("p", null, "Trascina il file degli eventi nell'area qui sopra, oppure usa un dataset d'esempio. La dashboard si ricalcola e si ridisegna in tempo reale a ogni file caricato \u2014 niente ricarica pagina."), /*#__PURE__*/React.createElement(VANS.Button, {
    variant: "primary",
    onClick: onLoadSample
  }, "Prova con un dataset d'esempio"), /*#__PURE__*/React.createElement("div", {
    className: "va-empty-cols mono"
  }, "match_id \xB7 competition \xB7 season \xB7 match_date \xB7 team_id \xB7 player_id \xB7 player_name \xB7 player_minutes \xB7 minute \xB7 second \xB7 x \xB7 y \xB7 type \xB7 outcome \xB7 xg"));
}

/* ---------- Filter bar ------------------------------------- */
function FilterBar({
  options,
  filters,
  set,
  maxMinutes
}) {
  const {
    Select,
    Slider,
    Switch,
    Tooltip,
    InfoDot
  } = VANS;
  return /*#__PURE__*/React.createElement("div", {
    className: "va-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "va-filters-grid"
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Competizione",
    multi: true,
    placeholder: "Tutte",
    options: options.competitions,
    value: filters.competition,
    onChange: v => set({
      competition: v
    })
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Stagione",
    multi: true,
    placeholder: "Tutte",
    options: options.seasons,
    value: filters.season,
    onChange: v => set({
      season: v
    })
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Squadra",
    multi: true,
    placeholder: "Tutte",
    options: options.teams,
    value: filters.team,
    onChange: v => set({
      team: v
    })
  }), /*#__PURE__*/React.createElement(Slider, {
    label: "Minuti giocati minimi",
    suffix: "\u2032",
    min: 0,
    max: maxMinutes,
    step: 45,
    value: filters.minMinutes,
    onChange: v => set({
      minMinutes: v
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "va-filters-foot"
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: filters.per90,
    onChange: v => set({
      per90: v
    }),
    label: "Normalizza per 90\u2032",
    hint: "Divide le metriche di conteggio per i minuti totali \xD7 90. Le percentuali non si normalizzano \u2014 confronta titolari e subentrati a parit\xE0 di tempo."
  })));
}

/* ---------- Ranking section (Chart.js) --------------------- */
function RankingSection({
  ranking,
  metric,
  setMetric,
  topN,
  setTopN,
  per90,
  onPick,
  selected
}) {
  const {
    Card,
    MetricSelector,
    Slider,
    StatTable,
    InfoDot
  } = VANS;
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);
  React.useEffect(() => {
    if (!canvasRef.current) return;
    const labels = ranking.map(r => r.player_name);
    const data = ranking.map(r => r.metricVal ?? 0);
    const colors = ranking.map(r => r.player_id === selected ? getCSS('--accent-500') : getCSS('--viola-600'));
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderRadius: 5,
          barThickness: 'flex',
          maxBarThickness: 22
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        onClick: (evt, els) => {
          if (els && els[0]) onPick(ranking[els[0].index].player_id);
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: getCSS('--viola-900'),
            padding: 10,
            cornerRadius: 8,
            titleFont: {
              family: getCSS('--font-body'),
              weight: '600'
            },
            bodyFont: {
              family: getCSS('--font-mono')
            },
            callbacks: {
              label: c => '  ' + fmtMetric(metric, c.parsed.x)
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(36,14,61,0.07)'
            },
            ticks: {
              font: {
                family: getCSS('--font-mono'),
                size: 11
              },
              color: getCSS('--text-muted')
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: getCSS('--font-body'),
                size: 12,
                weight: '500'
              },
              color: getCSS('--text-secondary')
            }
          }
        },
        animation: {
          duration: 450,
          easing: 'easeOutQuart'
        }
      }
    });
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [ranking, metric, selected]);
  const metricMeta = window.VAData.METRICS.find(m => m.value === metric);
  const cols = [{
    key: 'player_name',
    label: 'Giocatore',
    bold: true
  }, {
    key: 'minutes',
    label: 'Min',
    align: 'right',
    mono: true,
    muted: true,
    render: v => Math.round(v)
  }, {
    key: 'metricVal',
    label: metricMeta.label,
    align: 'right',
    mono: true,
    accent: true,
    render: v => v == null ? '—' : metricMeta.fmt(v)
  }];
  return /*#__PURE__*/React.createElement(Card, {
    eyebrow: "Sezione 1",
    title: "Classifica giocatori",
    actions: /*#__PURE__*/React.createElement("span", {
      className: "va-help-inline"
    }, "xG ", /*#__PURE__*/React.createElement(InfoDot, {
      label: "Gol attesi: stima dei gol dalla qualit\xE0 dei tiri. \xABGol \u2212 xG\xBB dice se finalizza sopra o sotto le attese."
    }))
  }, /*#__PURE__*/React.createElement(MetricSelector, {
    value: metric,
    onChange: setMetric,
    options: window.VAData.METRICS.map(m => ({
      value: m.value,
      label: m.label
    }))
  }), /*#__PURE__*/React.createElement("div", {
    className: "va-rank-controls"
  }, /*#__PURE__*/React.createElement(Slider, {
    label: "Top N",
    value: topN,
    onChange: setTopN,
    min: 3,
    max: Math.max(3, ranking._total || 14)
  }), per90 && /*#__PURE__*/React.createElement("span", {
    className: "va-per90-tag mono"
  }, "per 90\u2032")), /*#__PURE__*/React.createElement("div", {
    className: "va-chart",
    style: {
      height: Math.max(180, ranking.length * 30 + 24)
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef
  })), /*#__PURE__*/React.createElement("div", {
    className: "va-rank-table"
  }, /*#__PURE__*/React.createElement(StatTable, {
    rank: true,
    rows: ranking,
    highlightKey: {
      field: 'player_id',
      value: selected
    },
    columns: cols,
    onSort: null
  })), /*#__PURE__*/React.createElement("p", {
    className: "va-cap"
  }, "Clicca una barra o una riga per aprire la scheda del giocatore."));
}

/* ---------- Player section (KPIs + pitch) ------------------ */
function PlayerSection({
  players,
  selected,
  onSelect,
  stat,
  events,
  per90
}) {
  const {
    Card,
    Select,
    KpiCard,
    PitchMap,
    Legend,
    InfoDot,
    Badge
  } = VANS;
  if (!stat) return null;
  const num = (v, d = 0) => v == null ? '—' : v.toFixed(d);
  const goalsXg = stat.g_xg;
  return /*#__PURE__*/React.createElement(Card, {
    tone: "brand",
    eyebrow: "Sezione 2",
    title: "Scheda giocatore",
    actions: /*#__PURE__*/React.createElement(Select, {
      options: players,
      value: selected,
      onChange: onSelect,
      style: {
        minWidth: 200
      }
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "va-kpis"
  }, /*#__PURE__*/React.createElement(KpiCard, {
    label: "Minuti",
    value: Math.round(stat.minutes).toLocaleString('it-IT'),
    unit: "\u2032"
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "Gol",
    value: stat.goals
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "xG",
    value: num(stat.xg, 2),
    hint: /*#__PURE__*/React.createElement(InfoDot, {
      label: "Gol attesi dalla qualit\xE0 dei tiri."
    })
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "Gol \u2212 xG",
    value: (goalsXg > 0 ? '+' : '') + num(goalsXg, 2),
    accent: true,
    delta: goalsXg > 0 ? 'sopra le attese' : goalsXg < 0 ? 'sotto le attese' : 'in linea',
    deltaTone: goalsXg > 0 ? 'positive' : goalsXg < 0 ? 'danger' : 'neutral',
    hint: /*#__PURE__*/React.createElement(InfoDot, {
      label: "Positivo = finalizza meglio della media dei suoi tiri."
    })
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "% Passaggi",
    value: stat.pass_pct == null ? '—' : num(stat.pass_pct, 1),
    unit: stat.pass_pct == null ? '' : '%'
  }), /*#__PURE__*/React.createElement(KpiCard, {
    label: "% Contrasti",
    value: stat.tackle_pct == null ? '—' : num(stat.tackle_pct, 1),
    unit: stat.tackle_pct == null ? '' : '%'
  })), /*#__PURE__*/React.createElement("div", {
    className: "va-pitch-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "va-pitch-head"
  }, /*#__PURE__*/React.createElement("h4", null, "Mappa azioni"), /*#__PURE__*/React.createElement(Badge, {
    tone: "viola",
    dot: true
  }, events.length, " eventi")), /*#__PURE__*/React.createElement(PitchMap, {
    events: events
  }), /*#__PURE__*/React.createElement("div", {
    className: "va-pitch-foot"
  }, /*#__PURE__*/React.createElement(Legend, null), /*#__PURE__*/React.createElement("p", {
    className: "va-cap"
  }, "Attacco verso ", /*#__PURE__*/React.createElement("b", null, "destra"), " \u2192 \xB7 x:0 porta propria, x:100 porta avversaria \xB7 dimensione del tiro \u221D xG \xB7 bordo bianco = gol."))));
}

/* ---------- helpers ---------------------------------------- */
function getCSS(v) {
  return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
}
function fmtMetric(metric, v) {
  const m = window.VAData.METRICS.find(x => x.value === metric);
  return m ? `${m.label}: ${m.fmt(v)}` : String(v);
}
Object.assign(window, {
  Header,
  EmptyState,
  FilterBar,
  RankingSection,
  PlayerSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/match-analysis/sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.InfoDot = __ds_scope.InfoDot;

__ds_ns.Dropzone = __ds_scope.Dropzone;

__ds_ns.KpiCard = __ds_scope.KpiCard;

__ds_ns.Legend = __ds_scope.Legend;

__ds_ns.PitchMap = __ds_scope.PitchMap;

__ds_ns.StatTable = __ds_scope.StatTable;

__ds_ns.MetricSelector = __ds_scope.MetricSelector;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Slider = __ds_scope.Slider;

__ds_ns.Switch = __ds_scope.Switch;

})();
