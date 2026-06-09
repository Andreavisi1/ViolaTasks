import * as React from 'react';

/**
 * Single headline metric for the player scorecard.
 * @startingPoint section="Data" subtitle="KPI metric tile with delta" viewport="340x130"
 */
export interface KpiCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: string;
  delta?: React.ReactNode;
  deltaTone?: 'auto' | 'positive' | 'danger' | 'neutral';
  hint?: React.ReactNode;
  accent?: boolean;
  style?: React.CSSProperties;
}
export function KpiCard(props: KpiCardProps): JSX.Element;
