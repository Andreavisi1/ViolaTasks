import * as React from 'react';

/** Compact status / category label. */
export interface BadgeProps {
  children: React.ReactNode;
  tone?: 'neutral' | 'viola' | 'accent' | 'positive' | 'warning' | 'danger' | 'event';
  /** required when tone="event" — colors the dot by pitch event type */
  eventType?: 'pass' | 'shot' | 'tackle' | 'dribble' | 'foul';
  dot?: boolean;
  style?: React.CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;
