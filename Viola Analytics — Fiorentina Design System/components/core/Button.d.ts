import * as React from 'react';

/**
 * Primary action control for Viola Analytics. Viola fill by default.
 * @startingPoint section="Core" subtitle="Action button — viola / outline / ghost / danger" viewport="700x140"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** primary (viola fill) · secondary (outline) · ghost · danger */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
