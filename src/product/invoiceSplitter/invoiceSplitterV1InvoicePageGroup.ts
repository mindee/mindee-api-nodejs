import { StringDict } from "@/parsing/common/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * List of page groups. Each group represents a single invoice within a multi-invoice document.
 */
export class InvoiceSplitterV1InvoicePageGroup {
  /** List of page indexes that belong to the same invoice (group). */
  pageIndexes: Array<number> | null;
  /** Confidence score */
  confidence: number = 0.0;
  /** The document page on which the information was found. */
  pageId: number;
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon = new Polygon();

  constructor({ prediction = {} }: StringDict) {
    this.pageIndexes = prediction["page_indexes"];
    this.pageId = prediction["page_id"];
    this.confidence = prediction["confidence"] ? prediction.confidence : 0.0;
    if (prediction["polygon"]) {
      this.polygon = prediction.polygon;
    }
  }

  /**
   * Collection of fields as representable strings.
   */
  #printableValues() {
    return {
      pageIndexes: this.pageIndexes?.join(", ") ?? "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Page Indexes: " +
      printable.pageIndexes
    );
  }

  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.pageIndexes.padEnd(72) +
      " |"
    );
  }
}
