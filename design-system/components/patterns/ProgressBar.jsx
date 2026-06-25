import React from 'react';

const TONES = {
  blue: 'var(--primary)', cyan: 'var(--sell)', violet: 'var(--buy)',
  green: 'var(--success)', amber: 'var(--warning)', rose: 'var(--danger)',
};

/**
 * ProgressBar — thin rounded track with a tinted fill (desktop journey/progress
 * meter). Optional label row showing a caption and the percentage.
 */
export function ProgressBar({
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
  return (
    <div style={{ ...style }} {...rest}>
      {(label || showPct) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 6, fontFamily: 'var(--font-sans)',
        }}>
          {label && <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)' }}>{label}</span>}
          {showPct && (
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div style={{ height, borderRadius: 999, background: 'var(--bg-2)', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 999, background: fill,
          transition: 'width .4s var(--ease)',
        }} />
      </div>
    </div>
  );
}
