import React from 'react';

const TONES = {
  blue: 'var(--primary)', cyan: 'var(--sell)', violet: 'var(--buy)',
  green: 'var(--success)', amber: 'var(--warning)', rose: 'var(--danger)',
};

/**
 * StageStep — one node of the TARS home-ownership journey timeline. A numbered
 * (or checked) marker, title, optional caption, and a connector line. State:
 * `done` (filled + check), `active` (ring), `todo` (muted).
 */
export function StageStep({
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

  return (
    <div style={{ display: 'flex', gap: 12, ...style }} {...rest}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 28, height: 28, flex: '0 0 28px', borderRadius: '50%',
          background: markerBg, border: `2px solid ${markerBorder}`, color: markerFg,
          display: 'grid', placeItems: 'center', fontSize: 12.5, fontWeight: 700,
          fontFamily: 'var(--font-sans)',
        }}>
          {isDone ? '✓' : index}
        </div>
        {!last && (
          <div style={{ width: 2, flex: 1, minHeight: 18, marginTop: 2, background: isDone ? accent : 'var(--border)' }} />
        )}
      </div>
      <div style={{ paddingBottom: last ? 0 : 18 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)',
          color: isActive || isDone ? 'var(--ink)' : 'var(--ink-2)',
          lineHeight: 1.3,
        }}>
          {title}
        </div>
        {caption && (
          <div style={{ marginTop: 2, fontSize: 12.5, color: 'var(--ink-3)', fontFamily: 'var(--font-sans)' }}>
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
