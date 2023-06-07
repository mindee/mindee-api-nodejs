import { floatToString } from "../../parsing/standard";
import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * List of line item details.
 */
export class ReceiptV5LineItem {
  /** The item description. */
  description: string | null;
  /** The item quantity. */
  quantity: number | null;
  /** The item total amount. */
  totalAmount: number | null;
  /** The item unit price. */
  unitPrice: number | null;
  /** Confidence score */
  confidence: number = 0.0;
  /** The document page on which the information was found. */
  pageId: number;
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon = [];

  constructor({ prediction }: StringDict) {
    this.description = prediction["description"];
    this.quantity = +parseFloat(prediction["quantity"]).toFixed(3);
    if (isNaN(this.quantity)) {
      this.quantity = null;
    }
    this.totalAmount = +parseFloat(prediction["total_amount"]).toFixed(3);
    if (isNaN(this.totalAmount)) {
      this.totalAmount = null;
    }
    this.unitPrice = +parseFloat(prediction["unit_price"]).toFixed(3);
    if (isNaN(this.unitPrice)) {
      this.unitPrice = null;
    }
    this.pageId = prediction["page_id"];
    this.confidence = prediction["confidence"] ? prediction.confidence : 0.0;
    if (prediction["polygon"]) {
      this.polygon = prediction.polygon;
    }
  }

  #printableValues() {
    return {
      description: this.description ?? "",
      quantity: this.quantity !== null ? floatToString(this.quantity) : "",
      totalAmount:
        this.totalAmount !== null ? floatToString(this.totalAmount) : "",
      unitPrice: this.unitPrice !== null ? floatToString(this.unitPrice) : "",
    };
  }

  /**
   * Default string representation.
   */
  toString() {
    const printable = this.#printableValues();
    return (
      "Description: " +
      printable.description +
      "Quantity: " +
      printable.quantity +
      "Total Amount: " +
      printable.totalAmount +
      "Unit Price: " +
      printable.unitPrice
    ).trim();
  }
  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.description.padEnd(36) +
      " | " +
      printable.quantity.padEnd(8) +
      " | " +
      printable.totalAmount.padEnd(12) +
      " | " +
      printable.unitPrice.padEnd(10) +
      " |"
    );
  }
}
