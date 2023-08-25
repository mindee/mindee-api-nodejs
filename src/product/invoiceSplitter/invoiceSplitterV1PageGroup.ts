import { StringDict } from "../../parsing/common";

/**
 * Pages indexes in a group.
 */
export class InvoiceSplitterV1PageGroup {
  /** List of page indexes. */
  pageIndexes: number[] = [];
  /** Confidence score. */
  confidence: number;

  constructor(prediction: StringDict) {
    this.pageIndexes = prediction.page_indexes;
    this.confidence = prediction["confidence"];
  }

  /**
   * Default string representation.
   */
  toString(): string {
    return `:Page indexes: ${this.pageIndexes.join(", ")}`;
  }
}
