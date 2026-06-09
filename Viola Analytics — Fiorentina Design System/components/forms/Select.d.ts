import * as React from 'react';

type Option = string | { value: string; label: string };

/**
 * Single or multi select, populated from CSV-derived values.
 * @startingPoint section="Forms" subtitle="Single / multi dropdown with checkbox menu" viewport="700x300"
 */
export interface SelectProps {
  options: Option[];
  value: string | string[];
  onChange?: (v: string | string[]) => void;
  multi?: boolean;
  placeholder?: string;
  label?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export function Select(props: SelectProps): JSX.Element;
