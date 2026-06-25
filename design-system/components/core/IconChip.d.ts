import React from 'react';

export interface IconChipProps {
  /** Tint role. */
  tone?: 'blue' | 'cyan' | 'violet' | 'green' | 'amber' | 'rose';
  /** Square size in px (default 36). */
  size?: number;
  /** Corner radius in px (default 10). */
  radius?: number;
  style?: React.CSSProperties;
  /** Icon node (SVG / Lucide element). */
  children?: React.ReactNode;
}

/** IconChip — square rounded tinted container that anchors an icon in list rows, KPIs and tools. */
export function IconChip(props: IconChipProps): JSX.Element;
