import * as React from 'react';

type Option = string | { value: string; label: string };

/** Segmented pill control for choosing the active ranking metric. */
export interface MetricSelectorProps {
  options: Option[];
  value: string;
  onChange?: (v: string) => void;
  style?: React.CSSProperties;
}
export function MetricSelector(props: MetricSelectorProps): JSX.Element;
