import React from 'react';

export interface ProgressBarProps {
  /** Percent complete, 0–100. */
  value?: number;
  tone?: 'blue' | 'cyan' | 'violet' | 'green' | 'amber' | 'rose';
  /** Track height in px (default 8). */
  height?: number;
  /** Caption shown left of the percentage. */
  label?: React.ReactNode;
  /** Show the numeric percentage on the right. */
  showPct?: boolean;
  style?: React.CSSProperties;
}

/** ProgressBar — thin rounded progress meter with optional label/percentage row. */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
