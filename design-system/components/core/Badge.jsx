import React from 'react';

const TONES = {
  primary: ['var(--primary-2)', 'var(--primary)'],
  buy:     ['var(--buy-2)',     'var(--buy)'],
  sell:    ['var(--sell-2)',    'var(--sell)'],
  success: ['var(--success-2)', 'var(--success)'],
  warning: ['var(--warning-2)', 'var(--warning)'],
  danger:  ['var(--danger-2)',  'var(--danger)'],
  ghost:   ['var(--bg-2)',      'var(--ink-2)'],
};

/**
 * Badge — compact inline status tag (desktop `.badge-ds`). Smaller than Pill;
 * meant to sit inline in tables, list rows, and meta lines. 12px text, 999px
 * radius, optional leading dot.
 */
export function Badge({ tone = 'primary', dot = false, style = {}, children, ...rest }) {
  const [bg, fg] = TONES[tone] || TONES.primary;
  return (
    <span
      style={{
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
        ...style,
      }}
      {...rest}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: fg, flex: '0 0 6px' }} />}
      {children}
    </span>
  );
}
