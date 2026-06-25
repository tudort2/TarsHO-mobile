import React from 'react';

/**
 * ListRow — horizontal row: leading slot (IconChip/Avatar), title + subtitle,
 * and a trailing slot (Badge/Pill/value/chevron). The atom of TARS lists —
 * contacts, tasks, properties, activity feeds. Hairline divider, hover fill.
 */
export function ListRow({
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
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        borderBottom: divider ? '1px solid var(--border)' : 'none',
        background: hover && clickable ? 'var(--bg-2)' : 'transparent',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'background var(--dur) var(--ease)',
        ...style,
      }}
      {...rest}
    >
      {leading}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: 'var(--ink)',
          fontFamily: 'var(--font-sans)', lineHeight: 1.35,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{
            fontSize: 12.5, color: 'var(--ink-3)', fontFamily: 'var(--font-sans)',
            marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {subtitle}
          </div>
        )}
      </div>
      {trailing && <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8 }}>{trailing}</div>}
    </div>
  );
}
