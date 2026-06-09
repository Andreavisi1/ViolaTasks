import * as React from 'react';

/** Event-type key for the pitch map. */
export interface LegendProps {
  only?: Array<'pass' | 'shot' | 'tackle' | 'dribble' | 'foul'> | null;
  style?: React.CSSProperties;
}
export function Legend(props: LegendProps): JSX.Element;
