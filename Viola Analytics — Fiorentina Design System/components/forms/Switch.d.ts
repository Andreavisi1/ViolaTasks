import * as React from 'react';

/** Boolean toggle with optional label + hint (e.g. "Normalizza per 90′"). */
export interface SwitchProps {
  checked: boolean;
  onChange?: (v: boolean) => void;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export function Switch(props: SwitchProps): JSX.Element;
