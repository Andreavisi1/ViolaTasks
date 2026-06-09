import * as React from 'react';

/** Hover/focus tooltip that explains a technical or calcistic term. */
export interface TooltipProps {
  label: React.ReactNode;
  side?: 'top' | 'bottom';
  children: React.ReactNode;
  maxWidth?: number;
  style?: React.CSSProperties;
}
export function Tooltip(props: TooltipProps): JSX.Element;

/** Small "?" affordance with an attached Tooltip. */
export interface InfoDotProps {
  label: React.ReactNode;
  side?: 'top' | 'bottom';
}
export function InfoDot(props: InfoDotProps): JSX.Element;
