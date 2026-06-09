import * as React from 'react';

export interface StatColumn {
  key: string;
  label: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  mono?: boolean;
  bold?: boolean;
  muted?: boolean;
  accent?: boolean;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

/** Ordered numeric table for rankings. */
export interface StatTableProps {
  columns: StatColumn[];
  rows: any[];
  rank?: boolean;
  highlightKey?: { field: string; value: any } | null;
  sortKey?: string | null;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  style?: React.CSSProperties;
}
export function StatTable(props: StatTableProps): JSX.Element;
