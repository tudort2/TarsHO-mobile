import React from 'react';

export interface KPICardProps {
  /** Big metric value (string or number). */
  value: React.ReactNode;
  /** Caption beneath the value. */
  label: string;
  /** Leading icon node, shown inside a tinted IconChip. */
  icon?: React.ReactNode;
  /** Tint role for the IconChip + delta context. */
  tone?: 'blue' | 'cyan' | 'violet' | 'green' | 'amber' | 'rose';
  /** Optional change indicator, e.g. "12%". */
  delta?: React.ReactNode;
  /** Direction of the delta — sets arrow + green/rose color. */
  deltaDir?: 'up' | 'down';
  style?: React.CSSProperties;
}

/**
 * KPICard — large metric block with icon, value, label and optional delta.
 *
 * @startingPoint section="Patterns" subtitle="Stat cards with icon, value & delta" viewport="700x150"
 */
export function KPICard(props: KPICardProps): JSX.Element;
