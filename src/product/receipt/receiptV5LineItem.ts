import { floatToString } from "../../parsing/standard";
import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * List of line item details.
 */
export class ReceiptV5LineItem {
  /** The item description. */
  description: string | undefined;
  /** The item quantity. */
  quantity: number | undefined;
  /** The item total amount. */
  totalAmount: number | undefined;
  /** The item unit price. */
  unitPrice: number | undefined;
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
    if (prediction["quantity"] && !isNaN(prediction["quantity"])) {
      this.quantity = +parseFloat(prediction["quantity"]).toFixed(3);
    }
    if (prediction["total_amount"] && !isNaN(prediction["total_amount"])) {
      this.totalAmount = +parseFloat(prediction["total_amount"]).toFixed(3);
    }
    if (prediction["unit_price"] && !isNaN(prediction["unit_price"])) {
      this.unitPrice = +parseFloat(prediction["unit_price"]).toFixed(3);
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
          this.description :
          this.description.slice(0, 33) + "..." :
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
