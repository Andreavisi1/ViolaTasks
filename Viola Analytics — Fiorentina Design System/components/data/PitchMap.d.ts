import * as React from 'react';

/**
 * Drawn football pitch with events placed by x,y (0–100). Shots sized by xG.
 * @startingPoint section="Data" subtitle="Football pitch with plotted events" viewport="700x480"
 */
export interface PitchMapProps {
  events?: PitchEvent[];
  showStripes?: boolean;
  height?: number | string;
  style?: React.CSSProperties;
}

export interface PitchEvent {
  x: number; y: number;
  type: 'pass' | 'shot' | 'tackle' | 'dribble' | 'foul';
  outcome?: string;
  xg?: number;
}

export function PitchMap(props: PitchMapProps): JSX.Element;
