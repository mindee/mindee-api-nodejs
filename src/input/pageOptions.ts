/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Options to pass to the `parse` method for cutting multi-page documents.
 */
export interface PageOptions {
  /**
   * Zero-based list of page indexes.
   *
   * A negative index can be used, indicating an offset from the end of the document.
   *
   * [0, -1] represents the fist and last pages of the document.
   */
  pageIndexes: number[];
  /** Operation to apply on the document, given the `pageIndexes` specified. */
  operation: PageOptionsOperation;
  /**
   * Apply the operation only if document has at least this many pages.
   */
  onMinPages: number;
}

/**
 * Operation to apply on the document, given the page indexes specified.
 */
export enum PageOptionsOperation {
  /** Only keep pages matching the provided indexes. */
  KeepOnly = "KEEP_ONLY",
  /** Remove pages matching the provided indexes. */
  Remove = "REMOVE",
}
