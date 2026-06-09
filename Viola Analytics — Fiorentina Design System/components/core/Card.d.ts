import * as React from 'react';

/**
 * Surface container for dashboard panels.
 * @startingPoint section="Core" subtitle="Panel container with optional header" viewport="700x220"
 */
export interface CardProps {
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  tone?: 'default' | 'brand';
  pad?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
