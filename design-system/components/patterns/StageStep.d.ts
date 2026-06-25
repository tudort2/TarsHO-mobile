import React from 'react';

export interface StageStepProps {
  /** Step number shown when not done. */
  index: React.ReactNode;
  title: string;
  /** Sub-line under the title. */
  caption?: React.ReactNode;
  /** `done` = filled + check, `active` = ringed, `todo` = muted. */
  state?: 'done' | 'active' | 'todo';
  tone?: 'blue' | 'cyan' | 'violet' | 'green' | 'amber' | 'rose';
  /** Hide the connector after the last step. */
  last?: boolean;
  style?: React.CSSProperties;
}

/** StageStep — one node of the home-ownership journey timeline (numbered marker + connector). */
export function StageStep(props: StageStepProps): JSX.Element;
