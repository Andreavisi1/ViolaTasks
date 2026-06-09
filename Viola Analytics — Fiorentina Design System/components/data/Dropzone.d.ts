import * as React from 'react';

/**
 * Drag & drop + file-picker for a CSV upload.
 * @startingPoint section="Data" subtitle="CSV drag & drop upload zone" viewport="700x120"
 */
export interface DropzoneProps {
  onFile?: (file: File) => void;
  fileName?: string | null;
  rowCount?: number | null;
  error?: string | null;
  accept?: string;
  style?: React.CSSProperties;
}
export function Dropzone(props: DropzoneProps): JSX.Element;
