import React from 'react';
import { IconChip } from '../core/IconChip.jsx';

/**
 * KPICard — large metric block (desktop `.kpi-card`). A leading IconChip, a big
 * value in display type, a label, and an optional delta with up/down tone.
 */
export function KPICard({
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
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {icon && <IconChip tone={tone}>{icon}</IconChip>}
        {delta != null && (
          <span style={{ fontSize: 12, fontWeight: 700, color: deltaColor, fontFamily: 'var(--font-sans)' }}>
            {deltaDir === 'down' ? '↓' : '↑'} {delta}
          </span>
        )}
      </div>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 30,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: 'var(--text-display)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {value}
        </div>
        <div style={{
          marginTop: 4,
          fontSize: 12.5,
          fontWeight: 500,
          color: 'var(--ink-2)',
          fontFamily: 'var(--font-sans)',
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}
