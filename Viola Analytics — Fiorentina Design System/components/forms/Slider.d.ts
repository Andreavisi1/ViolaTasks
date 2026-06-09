import * as React from 'react';

/**
 * Single-value range control (Top N, minuti minimi).
 * @startingPoint section="Forms" subtitle="Range slider with mono readout" viewport="700x120"
 */
export interface SliderProps {
  value: number;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: React.ReactNode;
  suffix?: string;
  showValue?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export function Slider(props: SliderProps): JSX.Element;
