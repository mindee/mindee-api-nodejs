/**
 * Represent a split pdf.
 */
export interface SplitPdf {
  file: Uint8Array;
  totalPagesRemoved: number;
}
