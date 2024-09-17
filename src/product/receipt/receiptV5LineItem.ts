import { cleanSpecialChars, floatToString } from "../../parsing/common";
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

  constructor({ prediction = {} }: StringDict) {
    this.description = prediction["description"];
    if (
      prediction["quantity"] !== undefined &&
      prediction["quantity"] !== null &&
      !isNaN(prediction["quantity"])
    ) {
      this.quantity = +parseFloat(prediction["quantity"]);
    } else {
      this.quantity = null;
    }
    if (
      prediction["total_amount"] !== undefined &&
      prediction["total_amount"] !== null &&
      !isNaN(prediction["total_amount"])
    ) {
      this.totalAmount = +parseFloat(prediction["total_amount"]);
    } else {
      this.totalAmount = null;
    }
    if (
      prediction["unit_price"] !== undefined &&
      prediction["unit_price"] !== null &&
      !isNaN(prediction["unit_price"])
    ) {
      this.unitPrice = +parseFloat(prediction["unit_price"]);
    } else {
      this.unitPrice = null;
    }
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
      description: this.description ?
        this.description.length <= 36 ?
          cleanSpecialChars(this.description) :
          cleanSpecialChars(this.description).slice(0, 33) + "..." :
        "",
      quantity: this.quantity !== undefined ? floatToString(this.quantity) : "",
      totalAmount:
        this.totalAmount !== undefined ? floatToString(this.totalAmount) : "",
      unitPrice: this.unitPrice !== undefined ? floatToString(this.unitPrice) : "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Description: " +
      printable.description +
      ", Quantity: " +
      printable.quantity +
      ", Total Amount: " +
      printable.totalAmount +
      ", Unit Price: " +
      printable.unitPrice
    );
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
