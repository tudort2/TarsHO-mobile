/* @ds-bundle: {"format":3,"namespace":"TARSDesignSystem_9af650","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"IconChip","sourcePath":"components/core/IconChip.jsx"},{"name":"Pill","sourcePath":"components/core/Pill.jsx"},{"name":"KPICard","sourcePath":"components/patterns/KPICard.jsx"},{"name":"ListRow","sourcePath":"components/patterns/ListRow.jsx"},{"name":"ProgressBar","sourcePath":"components/patterns/ProgressBar.jsx"},{"name":"StageStep","sourcePath":"components/patterns/StageStep.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"6c9fbec3b17c","components/core/Badge.jsx":"39aead738938","components/core/Button.jsx":"bd935d8c022b","components/core/Card.jsx":"e7eb8d7b184a","components/core/Icon.jsx":"d40a67565d60","components/core/IconChip.jsx":"a65c12b37ee0","components/core/Pill.jsx":"6d2bdb964707","components/patterns/KPICard.jsx":"1b4e8ca3cafe","components/patterns/ListRow.jsx":"e9536a380795","components/patterns/ProgressBar.jsx":"a67cfb3c96bc","components/patterns/StageStep.jsx":"e42c68be466b","ui_kits/desktop/AppShell.jsx":"9dc3cc8010d9","ui_kits/desktop/DashboardScreen.jsx":"d6e14702687b","ui_kits/desktop/PipelineScreen.jsx":"f2d3e616ff69","ui_kits/desktop/data.js":"487fcbbf9fd0","ui_kits/mobile/MobileApp.jsx":"aef0b9aa8844","ui_kits/mobile/ios-frame.jsx":"be3343be4b51"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TARSDesignSystem_9af650 = window.TARSDesignSystem_9af650 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const GRADS = {
  blue: 'linear-gradient(135deg, var(--primary), #3B82F6)',
  cyan: 'linear-gradient(135deg, var(--sell), #22D3EE)',
  violet: 'linear-gradient(135deg, var(--buy), #A78BFA)',
  slate: 'linear-gradient(135deg, var(--tars-slate-500), var(--tars-slate-300))'
};
function initials(name = '') {
  return name.split(/\s+/).filter(t => /[a-z]/i.test(t)).slice(0, 2).map(t => t[0].toUpperCase()).join('');
}

/**
 * Avatar — circular user mark. Shows a photo when `src` is given, otherwise a
 * gradient-filled circle with the person's initials (desktop `.avatar`).
 */
function Avatar({
  name = '',
  src,
  size = 36,
  tone = 'blue',
  style = {},
  ...rest
}) {
  const fontSize = Math.round(size * 0.4);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: size,
      height: size,
      flex: `0 0 ${size}px`,
      borderRadius: '50%',
      background: src ? `center/cover no-repeat url(${src})` : GRADS[tone] || GRADS.blue,
      color: '#fff',
      display: 'grid',
      placeItems: 'center',
      fontWeight: 700,
      fontSize,
      fontFamily: 'var(--font-sans)',
      letterSpacing: '.2px',
      userSelect: 'none',
      ...style
    }
  }, rest), !src && initials(name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  primary: ['var(--primary-2)', 'var(--primary)'],
  buy: ['var(--buy-2)', 'var(--buy)'],
  sell: ['var(--sell-2)', 'var(--sell)'],
  success: ['var(--success-2)', 'var(--success)'],
  warning: ['var(--warning-2)', 'var(--warning)'],
  danger: ['var(--danger-2)', 'var(--danger)'],
  ghost: ['var(--bg-2)', 'var(--ink-2)']
};

/**
 * Badge — compact inline status tag (desktop `.badge-ds`). Smaller than Pill;
 * meant to sit inline in tables, list rows, and meta lines. 12px text, 999px
 * radius, optional leading dot.
 */
function Badge({
  tone = 'primary',
  dot = false,
  style = {},
  children,
  ...rest
}) {
  const [bg, fg] = TONES[tone] || TONES.primary;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 8px',
      borderRadius: 'var(--radius-full)',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'var(--font-sans)',
      lineHeight: 1.3,
      background: bg,
      color: fg,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: fg,
      flex: '0 0 6px'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — TARS primary action control.
 * Mirrors the desktop `.btn` family: dark default, brand-blue primary,
 * cyan "sell", ghost outline. Radius ~10px, 600 weight, subtle lift on hover.
 */
function Button({
  variant = 'primary',
  size = 'md',
  icon = null,
  iconRight = null,
  disabled = false,
  type = 'button',
  onClick,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '6px 10px',
      fontSize: 12,
      borderRadius: 8,
      gap: 6
    },
    md: {
      padding: '9px 14px',
      fontSize: 13,
      borderRadius: 10,
      gap: 8
    },
    lg: {
      padding: '12px 18px',
      fontSize: 14,
      borderRadius: 12,
      gap: 8
    }
  };
  const variants = {
    dark: {
      background: 'var(--ink)',
      color: 'var(--text-inverse)',
      border: '1px solid var(--ink)'
    },
    primary: {
      background: 'var(--primary)',
      color: '#fff',
      border: '1px solid var(--primary)'
    },
    sell: {
      background: 'var(--sell)',
      color: '#fff',
      border: '1px solid var(--sell)'
    },
    buy: {
      background: 'var(--buy)',
      color: '#fff',
      border: '1px solid var(--buy)'
    },
    danger: {
      background: 'var(--danger)',
      color: '#fff',
      border: '1px solid var(--danger)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink)',
      border: '1px solid var(--border-2)'
    }
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      padding: s.padding,
      fontSize: s.fontSize,
      fontWeight: 600,
      fontFamily: 'var(--font-sans)',
      lineHeight: 1,
      borderRadius: s.borderRadius,
      whiteSpace: 'nowrap',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transform: hover && !disabled ? 'translateY(-1px)' : 'none',
      boxShadow: hover && !disabled ? 'var(--shadow-sm)' : 'none',
      filter: hover && !disabled && variant === 'ghost' ? 'none' : undefined,
      background: hover && !disabled && variant === 'ghost' ? 'var(--bg-2)' : v.background,
      color: v.color,
      border: v.border,
      transition: 'transform .08s ease, box-shadow .12s ease, background .12s ease',
      ...style
    }
  }, rest), icon, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — surface container. Default has hairline border + soft shadow on a
 * white (--surface) background, radius 14. `flat` drops the shadow, `tinted`
 * uses the nested surface tone. `hover` adds the raised shadow on pointer.
 */
function Card({
  variant = 'default',
  hover = false,
  padding = 18,
  as: Tag = 'div',
  style = {},
  children,
  ...rest
}) {
  const [isHover, setHover] = React.useState(false);
  const base = {
    background: variant === 'tinted' ? 'var(--surface-2)' : 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding,
    boxShadow: variant === 'flat' ? 'none' : hover && isHover ? 'var(--shadow)' : 'var(--shadow-sm)',
    transition: 'box-shadow .15s ease, background var(--dur) var(--ease), border-color var(--dur) var(--ease)'
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    onMouseEnter: hover ? () => setHover(true) : undefined,
    onMouseLeave: hover ? () => setHover(false) : undefined,
    style: {
      ...base,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon — TARS standard stroke icon (Lucide set, 1.75 stroke, round caps).
 * A curated subset is inlined so cards/kits render offline. Pass `name`,
 * `size` (px) and `color` (defaults to currentColor).
 */
const PATHS = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5',
  building: 'M3 21h18M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M9 7h2M9 11h2M9 15h2M19 21V11a1 1 0 0 0-1-1h-3',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  trendingUp: 'm3 17 6-6 4 4 8-8M21 7v6M21 7h-6',
  trendingDown: 'm3 7 6 6 4-4 8 8M21 17v-6M21 17h-6',
  dollar: 'M12 2v20M17 6.5C17 4.6 14.8 3 12 3S7 4.6 7 6.5 9.2 10 12 10s5 1.6 5 3.5S14.8 17 12 17s-5-1.6-5-3.5',
  check: 'm20 6-11 11-5-5',
  checkCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  chevronRight: 'm9 6 6 6-6 6',
  chevronDown: 'm6 9 6 6 6-6',
  chevronLeft: 'm15 6-6 6 6 6',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  plus: 'M12 5v14M5 12h14',
  fileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  mapPin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM22 7l-10 6L2 7',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z',
  menu: 'M3 12h18M3 6h18M3 18h18',
  heart: 'M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 12 5 5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z',
  key: 'M12.6 11.4A6 6 0 1 0 8 16l2 2 2-2 2 2 2-2-2-2 .6-.6ZM16 8h.01',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
  briefcase: 'M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2ZM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 12h20',
  layers: 'm12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5',
  moreH: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
};
function Icon({
  name = 'home',
  size = 18,
  color = 'currentColor',
  strokeWidth = 1.75,
  style = {},
  ...rest
}) {
  const d = PATHS[name] || PATHS.home;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: 'block',
      flex: '0 0 auto',
      ...style
    },
    "aria-hidden": "true"
  }, rest), d.split(' M').map((seg, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: i === 0 ? seg : 'M' + seg
  })));
}
const ICON_NAMES = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  blue: ['var(--primary-2)', 'var(--primary)'],
  cyan: ['var(--sell-2)', 'var(--sell)'],
  violet: ['var(--buy-2)', 'var(--buy)'],
  green: ['var(--success-2)', 'var(--success)'],
  amber: ['var(--warning-2)', 'var(--warning)'],
  rose: ['var(--danger-2)', 'var(--danger)']
};

/**
 * IconChip — square rounded icon container (desktop `.chip`). A tinted
 * background + matching accent icon, used to anchor list rows, KPIs, and tools.
 */
function IconChip({
  tone = 'blue',
  size = 36,
  radius = 10,
  style = {},
  children,
  ...rest
}) {
  const [bg, fg] = TONES[tone] || TONES.blue;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: size,
      height: size,
      flex: `0 0 ${size}px`,
      borderRadius: radius,
      background: bg,
      color: fg,
      display: 'grid',
      placeItems: 'center',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconChip.jsx", error: String((e && e.message) || e) }); }

// components/core/Pill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  primary: ['var(--primary-2)', 'var(--primary)'],
  buy: ['var(--buy-2)', 'var(--buy)'],
  sell: ['var(--sell-2)', 'var(--sell)'],
  success: ['var(--success-2)', 'var(--success)'],
  warning: ['var(--warning-2)', '#A8771F'],
  danger: ['var(--danger-2)', 'var(--danger)'],
  ghost: ['var(--bg-2)', 'var(--ink-2)']
};

/**
 * Pill — rounded status / type tag (desktop `.pill`). Soft tinted background +
 * accent text, 999px radius. Use for property status, contact type, journey
 * role. Pass `dot` for a leading status dot.
 */
function Pill({
  tone = 'primary',
  dot = false,
  minWidth,
  style = {},
  children,
  ...rest
}) {
  const [bg, fg] = TONES[tone] || TONES.primary;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: minWidth ? 'center' : undefined,
      gap: 6,
      padding: '4px 9px',
      minWidth,
      borderRadius: 'var(--radius-full)',
      fontSize: 11.5,
      fontWeight: 600,
      fontFamily: 'var(--font-sans)',
      lineHeight: 1.4,
      background: bg,
      color: fg,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: fg,
      flex: '0 0 6px'
    }
  }), children);
}
Object.assign(__ds_scope, { Pill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Pill.jsx", error: String((e && e.message) || e) }); }

// components/patterns/KPICard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * KPICard — large metric block (desktop `.kpi-card`). A leading IconChip, a big
 * value in display type, a label, and an optional delta with up/down tone.
 */
function KPICard({
  value,
  label,
  icon = null,
  tone = 'blue',
  delta = null,
  deltaDir = 'up',
  style = {},
  ...rest
}) {
  const deltaColor = deltaDir === 'down' ? 'var(--danger)' : 'var(--success)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-sm)',
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.IconChip, {
    tone: tone
  }, icon), delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: deltaColor,
      fontFamily: 'var(--font-sans)'
    }
  }, deltaDir === 'down' ? '↓' : '↑', " ", delta)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 30,
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      color: 'var(--text-display)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 12.5,
      fontWeight: 500,
      color: 'var(--ink-2)',
      fontFamily: 'var(--font-sans)'
    }
  }, label)));
}
Object.assign(__ds_scope, { KPICard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/KPICard.jsx", error: String((e && e.message) || e) }); }

// components/patterns/ListRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ListRow — horizontal row: leading slot (IconChip/Avatar), title + subtitle,
 * and a trailing slot (Badge/Pill/value/chevron). The atom of TARS lists —
 * contacts, tasks, properties, activity feeds. Hairline divider, hover fill.
 */
function ListRow({
  leading = null,
  title,
  subtitle = null,
  trailing = null,
  divider = true,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const clickable = !!onClick;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px',
      borderBottom: divider ? '1px solid var(--border)' : 'none',
      background: hover && clickable ? 'var(--bg-2)' : 'transparent',
      cursor: clickable ? 'pointer' : 'default',
      transition: 'background var(--dur) var(--ease)',
      ...style
    }
  }, rest), leading, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--ink)',
      fontFamily: 'var(--font-sans)',
      lineHeight: 1.35,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-3)',
      fontFamily: 'var(--font-sans)',
      marginTop: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, subtitle)), trailing && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, trailing));
}
Object.assign(__ds_scope, { ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/ListRow.jsx", error: String((e && e.message) || e) }); }

// components/patterns/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  blue: 'var(--primary)',
  cyan: 'var(--sell)',
  violet: 'var(--buy)',
  green: 'var(--success)',
  amber: 'var(--warning)',
  rose: 'var(--danger)'
};

/**
 * ProgressBar — thin rounded track with a tinted fill (desktop journey/progress
 * meter). Optional label row showing a caption and the percentage.
 */
function ProgressBar({
  value = 0,
  tone = 'blue',
  height = 8,
  label = null,
  showPct = false,
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value));
  const fill = TONES[tone] || TONES.blue;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...style
    }
  }, rest), (label || showPct) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 6,
      fontFamily: 'var(--font-sans)'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: 'var(--ink-2)'
    }
  }, label), showPct && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--ink)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, Math.round(pct), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      borderRadius: 999,
      background: 'var(--bg-2)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: '100%',
      borderRadius: 999,
      background: fill,
      transition: 'width .4s var(--ease)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/patterns/StageStep.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  blue: 'var(--primary)',
  cyan: 'var(--sell)',
  violet: 'var(--buy)',
  green: 'var(--success)',
  amber: 'var(--warning)',
  rose: 'var(--danger)'
};

/**
 * StageStep — one node of the TARS home-ownership journey timeline. A numbered
 * (or checked) marker, title, optional caption, and a connector line. State:
 * `done` (filled + check), `active` (ring), `todo` (muted).
 */
function StageStep({
  index,
  title,
  caption = null,
  state = 'todo',
  tone = 'blue',
  last = false,
  style = {},
  ...rest
}) {
  const accent = TONES[tone] || TONES.blue;
  const isDone = state === 'done';
  const isActive = state === 'active';
  const markerBg = isDone ? accent : isActive ? 'var(--surface)' : 'var(--bg-2)';
  const markerBorder = isActive ? accent : isDone ? accent : 'var(--border-2)';
  const markerFg = isDone ? '#fff' : isActive ? accent : 'var(--ink-3)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 12,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      flex: '0 0 28px',
      borderRadius: '50%',
      background: markerBg,
      border: `2px solid ${markerBorder}`,
      color: markerFg,
      display: 'grid',
      placeItems: 'center',
      fontSize: 12.5,
      fontWeight: 700,
      fontFamily: 'var(--font-sans)'
    }
  }, isDone ? '✓' : index), !last && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 2,
      flex: 1,
      minHeight: 18,
      marginTop: 2,
      background: isDone ? accent : 'var(--border)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: last ? 0 : 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      fontFamily: 'var(--font-sans)',
      color: isActive || isDone ? 'var(--ink)' : 'var(--ink-2)',
      lineHeight: 1.3
    }
  }, title), caption && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: 12.5,
      color: 'var(--ink-3)',
      fontFamily: 'var(--font-sans)'
    }
  }, caption)));
}
Object.assign(__ds_scope, { StageStep });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/StageStep.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/AppShell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// AppShell — desktop frame: left sidebar nav + top bar (role switcher, search, theme).
const {
  Avatar,
  Icon,
  Pill
} = window.TARSDesignSystem_9af650;
function NavItem({
  icon,
  label,
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      width: '100%',
      padding: '9px 12px',
      border: 'none',
      borderRadius: 10,
      textAlign: 'left',
      background: active ? 'var(--primary-2)' : hover ? 'var(--bg-2)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--ink-2)',
      fontSize: 13.5,
      fontWeight: active ? 600 : 500,
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer',
      transition: 'background var(--dur) var(--ease)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    color: active ? 'var(--primary)' : 'var(--ink-3)'
  }), label);
}
function AppShell({
  active,
  onNav,
  role,
  onRole,
  theme,
  onTheme,
  children
}) {
  const nav = [{
    id: 'dashboard',
    icon: 'home',
    label: 'Dashboard'
  }, {
    id: 'pipeline',
    icon: 'layers',
    label: 'Pipeline'
  }, {
    id: 'property',
    icon: 'building',
    label: 'My property'
  }, {
    id: 'documents',
    icon: 'fileText',
    label: 'Documents'
  }, {
    id: 'contacts',
    icon: 'users',
    label: 'Contacts'
  }, {
    id: 'calendar',
    icon: 'calendar',
    label: 'Calendar'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      background: 'var(--bg)',
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 232,
      flex: '0 0 232px',
      borderRight: '1px solid var(--border)',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '4px 6px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 10,
      background: 'linear-gradient(135deg,var(--primary),var(--sell))',
      display: 'grid',
      placeItems: 'center',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "home",
    size: 18,
    color: "#fff",
    strokeWidth: 2.2
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 16,
      letterSpacing: '-0.4px',
      lineHeight: 1
    }
  }, "TARS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '1.2px',
      color: 'var(--ink-3)',
      marginTop: 2
    }
  }, "HOME OWNERSHIP"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, nav.map(n => /*#__PURE__*/React.createElement(NavItem, _extends({
    key: n.id
  }, n, {
    active: active === n.id,
    onClick: () => onNav(n.id)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      borderTop: '1px solid var(--border)',
      paddingTop: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Alex Johnson",
    size: 34
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "Alex Johnson"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--ink-3)'
    }
  }, role)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      height: 60,
      flex: '0 0 60px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '0 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      flex: 1,
      maxWidth: 360,
      padding: '8px 12px',
      background: 'var(--bg-2)',
      borderRadius: 10,
      color: 'var(--ink-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "Search properties, contacts, documents\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      background: 'var(--bg-2)',
      padding: 3,
      borderRadius: 999
    }
  }, window.TARS_DATA.roles.map(r => /*#__PURE__*/React.createElement("button", {
    key: r,
    onClick: () => onRole(r),
    style: {
      border: 'none',
      borderRadius: 999,
      padding: '6px 12px',
      fontSize: 12.5,
      fontWeight: 600,
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer',
      background: role === r ? 'var(--surface)' : 'transparent',
      color: role === r ? 'var(--ink)' : 'var(--ink-3)',
      boxShadow: role === r ? 'var(--shadow-sm)' : 'none'
    }
  }, r))), /*#__PURE__*/React.createElement("button", {
    onClick: onTheme,
    title: "Toggle theme",
    style: {
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      borderRadius: 10,
      width: 38,
      height: 38,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: theme === 'dark' ? 'home' : 'layers',
    size: 17
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      borderRadius: 10,
      width: 38,
      height: 38,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 17
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 7,
      right: 8,
      width: 7,
      height: 7,
      borderRadius: 999,
      background: 'var(--danger)',
      border: '2px solid var(--surface)'
    }
  }))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: 24
    }
  }, children)));
}
window.AppShell = AppShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/DashboardScreen.jsx
try { (() => {
// DashboardScreen — homeowner overview: KPIs, journey, property, tasks, contacts, activity.
const {
  Card,
  KPICard,
  ProgressBar,
  StageStep,
  ListRow,
  Avatar,
  Badge,
  Pill,
  Icon,
  IconChip,
  Button
} = window.TARSDesignSystem_9af650;
function SectionHead({
  children,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: '-0.2px',
      color: 'var(--ink)'
    }
  }, children), action);
}
function DashboardScreen() {
  const D = window.TARS_DATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      fontWeight: 600,
      letterSpacing: '.04em',
      textTransform: 'uppercase'
    }
  }, "Good morning"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '4px 0 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 30,
      letterSpacing: '-0.6px'
    }
  }, "Welcome back, Alex")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "fileText",
      size: 15
    })
  }, "Statements"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 15,
      color: "#fff"
    })
  }, "New request"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, D.kpis.map((k, i) => /*#__PURE__*/React.createElement(KPICard, {
    key: i,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: k.icon
    }),
    tone: k.tone,
    value: k.value,
    label: k.label,
    delta: k.delta,
    deltaDir: k.dir
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 20,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 120,
      background: 'linear-gradient(135deg, var(--primary), var(--sell))',
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-end',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: "ghost",
    style: {
      background: 'rgba(255,255,255,.92)',
      color: 'var(--ink)'
    },
    dot: true
  }, D.property.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18
    }
  }, D.property.address), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      marginTop: 2
    }
  }, D.property.city), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 12,
      fontSize: 13,
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement("span", null, D.property.beds, " beds"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, D.property.baths, " baths"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, D.property.sqft, " sqft"))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--ink-3)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.04em'
    }
  }, "Purchased"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontSize: 18,
      marginTop: 2
    }
  }, D.property.purchase), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)'
    }
  }, D.property.purchased)))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionHead, {
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: "primary",
      dot: true
    }, "Stage 5 of 6")
  }, "Your ownership journey"), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 70,
    tone: "blue",
    style: {
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("div", null, D.journey.map((s, i) => /*#__PURE__*/React.createElement(StageStep, {
    key: i,
    index: i + 1,
    title: s.title,
    caption: s.caption,
    state: s.state,
    last: i === D.journey.length - 1
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 8px'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    action: /*#__PURE__*/React.createElement("a", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--primary)'
      }
    }, "View all")
  }, "Tasks")), D.tasks.map((t, i) => /*#__PURE__*/React.createElement(ListRow, {
    key: i,
    leading: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 20,
        height: 20,
        borderRadius: 6,
        border: `2px solid ${t.done ? 'var(--success)' : 'var(--border-2)'}`,
        background: t.done ? 'var(--success)' : 'transparent',
        display: 'grid',
        placeItems: 'center'
      }
    }, t.done && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 12,
      color: "#fff",
      strokeWidth: 3
    })),
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        textDecoration: t.done ? 'line-through' : 'none',
        color: t.done ? 'var(--ink-3)' : 'var(--ink)'
      }
    }, t.title),
    trailing: /*#__PURE__*/React.createElement(Badge, {
      tone: t.tone
    }, t.due),
    divider: i < D.tasks.length - 1
  }))), /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 8px'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, null, "Your team")), D.contacts.map((c, i) => /*#__PURE__*/React.createElement(ListRow, {
    key: i,
    leading: /*#__PURE__*/React.createElement(Avatar, {
      name: c.name,
      tone: c.tone,
      size: 36
    }),
    title: c.name,
    subtitle: `${c.role} · ${c.org}`,
    trailing: /*#__PURE__*/React.createElement("button", {
      style: {
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        borderRadius: 9,
        width: 32,
        height: 32,
        display: 'grid',
        placeItems: 'center',
        color: 'var(--ink-2)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "phone",
      size: 15
    })),
    divider: i < D.contacts.length - 1
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionHead, null, "Recent activity"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, D.activity.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 11,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(IconChip, {
    tone: a.tone,
    size: 32,
    radius: 9
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink)',
      lineHeight: 1.35
    }
  }, a.text), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--ink-3)'
    }
  }, a.time)))))))));
}
window.DashboardScreen = DashboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/PipelineScreen.jsx
try { (() => {
// PipelineScreen — broker CRM kanban of deals across stages.
const {
  Card,
  Avatar,
  Badge,
  Pill,
  Icon,
  Button,
  KPICard
} = window.TARSDesignSystem_9af650;
function PipelineCard({
  c,
  tone
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: 12,
      boxShadow: hover ? 'var(--shadow)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'all .14s var(--ease)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: c.name,
    tone: tone,
    size: 34
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, c.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)'
    }
  }, c.detail))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 11.5,
      color: 'var(--ink-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 13
  }), " ", c.when), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      borderRadius: 8,
      width: 28,
      height: 28,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 13
  })), /*#__PURE__*/React.createElement("button", {
    style: {
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      borderRadius: 8,
      width: 28,
      height: 28,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 13
  })))));
}
function PipelineScreen() {
  const D = window.TARS_DATA;
  const total = D.pipeline.reduce((n, col) => n + col.cards.length, 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      fontWeight: 600,
      letterSpacing: '.04em',
      textTransform: 'uppercase'
    }
  }, "Broker workspace"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '4px 0 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 28,
      letterSpacing: '-0.6px'
    }
  }, "Deal pipeline")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 15
    })
  }, "Filter"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 15,
      color: "#fff"
    })
  }, "Add deal"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(KPICard, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "users"
    }),
    tone: "blue",
    value: total,
    label: "Active deals",
    delta: "2",
    deltaDir: "up"
  }), /*#__PURE__*/React.createElement(KPICard, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "dollar"
    }),
    tone: "green",
    value: "$4.6M",
    label: "Pipeline value",
    delta: "12%",
    deltaDir: "up"
  }), /*#__PURE__*/React.createElement(KPICard, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "checkCircle"
    }),
    tone: "violet",
    value: "68%",
    label: "Close rate",
    delta: "5%",
    deltaDir: "up"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16,
      alignItems: 'start'
    }
  }, D.pipeline.map((col, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--bg-2)',
      borderRadius: 14,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '2px 4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontSize: 13,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 999,
      background: `var(--${col.tone === 'blue' ? 'primary' : col.tone === 'violet' ? 'buy' : col.tone === 'amber' ? 'warning' : 'success'})`
    }
  }), col.stage), /*#__PURE__*/React.createElement(Badge, {
    tone: "ghost"
  }, col.cards.length)), col.cards.map((c, j) => /*#__PURE__*/React.createElement(PipelineCard, {
    key: j,
    c: c,
    tone: col.tone === 'amber' ? 'blue' : col.tone
  })), /*#__PURE__*/React.createElement("button", {
    style: {
      border: '1px dashed var(--border-2)',
      background: 'transparent',
      borderRadius: 10,
      padding: '9px',
      fontSize: 12.5,
      fontWeight: 600,
      color: 'var(--ink-3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  }), " Add")))));
}
window.PipelineScreen = PipelineScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/PipelineScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/data.js
try { (() => {
// TARS — desktop UI kit mock data (home-ownership domain)
window.TARS_DATA = {
  user: {
    name: 'Alex Johnson',
    role: 'Homeowner',
    email: 'alex.johnson@email.com'
  },
  roles: ['Homeowner', 'Buyer', 'Seller', 'Broker'],
  kpis: [{
    icon: 'dollar',
    tone: 'blue',
    value: '$842K',
    label: 'Home value',
    delta: '4.2%',
    dir: 'up'
  }, {
    icon: 'trendingUp',
    tone: 'violet',
    value: '$318K',
    label: 'Home equity',
    delta: '6.1%',
    dir: 'up'
  }, {
    icon: 'layers',
    tone: 'cyan',
    value: '5.875%',
    label: 'Mortgage rate',
    delta: null,
    dir: 'up'
  }, {
    icon: 'briefcase',
    tone: 'green',
    value: '$3,240',
    label: 'Monthly payment',
    delta: '1.0%',
    dir: 'down'
  }],
  property: {
    address: '2841 NE 24th Pl',
    city: 'Bellevue, WA 98004',
    beds: 4,
    baths: 3,
    sqft: '2,640',
    status: 'Owned',
    purchase: '$724,000',
    purchased: 'Mar 2021'
  },
  journey: [{
    title: 'Pre-approval secured',
    caption: 'Completed Jan 2021',
    state: 'done'
  }, {
    title: 'Home search',
    caption: 'Completed Feb 2021',
    state: 'done'
  }, {
    title: 'Offer accepted',
    caption: 'Completed Mar 2021',
    state: 'done'
  }, {
    title: 'Closing & move-in',
    caption: 'Completed Mar 2021',
    state: 'done'
  }, {
    title: 'Refinance review',
    caption: 'In progress · due soon',
    state: 'active'
  }, {
    title: 'Equity planning',
    caption: 'Upcoming',
    state: 'todo'
  }],
  tasks: [{
    title: 'Upload 2025 tax return',
    due: 'Due tomorrow',
    tone: 'rose',
    done: false
  }, {
    title: 'Review refinance offer',
    due: 'Due in 3 days',
    tone: 'amber',
    done: false
  }, {
    title: 'Schedule appraisal',
    due: 'Due in 1 week',
    tone: 'blue',
    done: false
  }, {
    title: 'Sign disclosure packet',
    due: 'Completed',
    tone: 'green',
    done: true
  }],
  contacts: [{
    name: 'Sarah Mitchell',
    role: 'Loan officer',
    tone: 'blue',
    org: 'TARS Lending'
  }, {
    name: 'Marcus Reed',
    role: 'Real estate agent',
    tone: 'violet',
    org: 'Cascade Realty'
  }, {
    name: 'Lisa Chen',
    role: 'Closing coordinator',
    tone: 'cyan',
    org: 'TARS Title'
  }],
  activity: [{
    icon: 'fileText',
    tone: 'blue',
    text: 'Refinance application received',
    time: '2h ago'
  }, {
    icon: 'check',
    tone: 'green',
    text: 'Disclosure packet signed',
    time: 'Yesterday'
  }, {
    icon: 'dollar',
    tone: 'violet',
    text: 'Home value updated · +$12,400',
    time: '3 days ago'
  }, {
    icon: 'mail',
    tone: 'cyan',
    text: 'Message from Sarah Mitchell',
    time: '4 days ago'
  }],
  // Broker pipeline view
  pipeline: [{
    stage: 'New leads',
    tone: 'blue',
    cards: [{
      name: 'Priya Nair',
      detail: 'Buyer · $650K budget',
      when: '2d'
    }, {
      name: 'Tom Becker',
      detail: 'Seller · Kirkland',
      when: '3d'
    }]
  }, {
    stage: 'Qualified',
    tone: 'violet',
    cards: [{
      name: 'The Okafors',
      detail: 'Buyer · pre-approved',
      when: '1d'
    }, {
      name: 'Dana Liu',
      detail: 'Seller · listing prep',
      when: '5d'
    }]
  }, {
    stage: 'Under contract',
    tone: 'amber',
    cards: [{
      name: 'J. Martinez',
      detail: 'Buyer · inspection',
      when: 'Today'
    }]
  }, {
    stage: 'Closed',
    tone: 'green',
    cards: [{
      name: 'Alex Johnson',
      detail: 'Refinance · $318K',
      when: '6h'
    }, {
      name: 'The Wattses',
      detail: 'Buyer · $1.1M',
      when: '1w'
    }]
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/data.js", error: String((e && e.message) || e) }); }

// ui_kits/mobile/MobileApp.jsx
try { (() => {
// MobileApp — TARS iOS app: dashboard, journey, contacts with a bottom tab bar.
const {
  Card,
  KPICard,
  ProgressBar,
  StageStep,
  ListRow,
  Avatar,
  Badge,
  Pill,
  Icon,
  IconChip
} = window.TARSDesignSystem_9af650;
function MHeader({
  title,
  subtitle
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 20px 14px'
    }
  }, subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--ink-3)',
      letterSpacing: '.04em',
      textTransform: 'uppercase'
    }
  }, subtitle), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '3px 0 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 24,
      letterSpacing: '-0.5px'
    }
  }, title));
}
function DashboardTab() {
  const D = window.TARS_DATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 12
    }
  }, /*#__PURE__*/React.createElement(MHeader, {
    subtitle: "Good morning",
    title: "Hi, Alex"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: 'var(--shadow)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 96,
      background: 'linear-gradient(135deg, var(--primary), var(--sell))',
      display: 'flex',
      alignItems: 'flex-start',
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: "ghost",
    style: {
      background: 'rgba(255,255,255,.92)',
      color: 'var(--ink)'
    },
    dot: true
  }, D.property.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 17
    }
  }, D.property.address), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-3)',
      marginTop: 2
    }
  }, D.property.city), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-3)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.04em'
    }
  }, "Est. value"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontSize: 19,
      marginTop: 1
    }
  }, "$842,000")), /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    dot: true
  }, "+4.2%")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, D.kpis.slice(1, 3).map((k, i) => /*#__PURE__*/React.createElement(KPICard, {
    key: i,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: k.icon
    }),
    tone: k.tone,
    value: k.value,
    label: k.label,
    delta: k.delta,
    deltaDir: k.dir
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 15
    }
  }, "Your journey"), /*#__PURE__*/React.createElement(Badge, {
    tone: "primary",
    dot: true
  }, "5 of 6")), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 70,
    tone: "blue",
    style: {
      marginBottom: 14
    }
  }), D.journey.slice(3, 6).map((s, i, arr) => /*#__PURE__*/React.createElement(StageStep, {
    key: i,
    index: i + 4,
    title: s.title,
    caption: s.caption,
    state: s.state,
    last: i === arr.length - 1
  })))));
}
function JourneyTab() {
  const D = window.TARS_DATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 12
    }
  }, /*#__PURE__*/React.createElement(MHeader, {
    subtitle: "Home ownership",
    title: "Journey"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(ProgressBar, {
    value: 70,
    tone: "blue",
    label: "Overall progress",
    showPct: true,
    style: {
      marginBottom: 18
    }
  }), D.journey.map((s, i) => /*#__PURE__*/React.createElement(StageStep, {
    key: i,
    index: i + 1,
    title: s.title,
    caption: s.caption,
    state: s.state,
    last: i === D.journey.length - 1
  })))));
}
function ContactsTab() {
  const D = window.TARS_DATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 12
    }
  }, /*#__PURE__*/React.createElement(MHeader, {
    subtitle: "Your team",
    title: "Contacts"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: 'hidden'
    }
  }, D.contacts.map((c, i) => /*#__PURE__*/React.createElement(ListRow, {
    key: i,
    leading: /*#__PURE__*/React.createElement(Avatar, {
      name: c.name,
      tone: c.tone,
      size: 40
    }),
    title: c.name,
    subtitle: `${c.role} · ${c.org}`,
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "chevronRight",
      size: 18,
      color: "var(--ink-3)"
    }),
    divider: i < D.contacts.length - 1
  })))));
}
function MobileApp() {
  const [tab, setTab] = React.useState('home');
  const tabs = [{
    id: 'home',
    icon: 'home',
    label: 'Home'
  }, {
    id: 'journey',
    icon: 'layers',
    label: 'Journey'
  }, {
    id: 'contacts',
    icon: 'users',
    label: 'Team'
  }];
  const body = tab === 'home' ? /*#__PURE__*/React.createElement(DashboardTab, null) : tab === 'journey' ? /*#__PURE__*/React.createElement(JourneyTab, null) : /*#__PURE__*/React.createElement(ContactsTab, null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--bg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      paddingTop: 52
    }
  }, body), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      padding: '8px 24px 4px'
    }
  }, tabs.map(t => {
    const on = tab === t.id;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setTab(t.id),
      style: {
        flex: 1,
        border: 'none',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: '4px 0',
        cursor: 'pointer',
        color: on ? 'var(--primary)' : 'var(--ink-3)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 22,
      color: on ? 'var(--primary)' : 'var(--ink-3)',
      strokeWidth: on ? 2.2 : 1.75
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 600
      }
    }, t.label));
  })));
}
window.MobileApp = MobileApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/MobileApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/ios-frame.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/ios-frame.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.IconChip = __ds_scope.IconChip;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.KPICard = __ds_scope.KPICard;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StageStep = __ds_scope.StageStep;

})();
