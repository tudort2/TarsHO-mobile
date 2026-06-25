import React from 'react';

export interface ListRowProps {
  /** Leading node — usually an Avatar or IconChip. */
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Trailing node(s) — Badge, value, chevron, etc. */
  trailing?: React.ReactNode;
  /** Show the bottom hairline divider (default true). */
  divider?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/** ListRow — the atom of TARS lists (contacts, tasks, properties): leading · title/subtitle · trailing. */
export function ListRow(props: ListRowProps): JSX.Element;
