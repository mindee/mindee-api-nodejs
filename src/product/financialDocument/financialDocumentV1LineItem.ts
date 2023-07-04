import { StringDict, floatToString } from "../../parsing/standard";
import { Polygon } from "../../geometry";

/**
 * List of line item details.
 */
export class FinancialDocumentV1LineItem {
  /** The item description. */
  description: string | null;
  /** The product code referring to the item. */
  productCode: string | null;
  /** The item quantity */
  quantity: number | null;
  /** The item tax amount. */
  taxAmount: number | null;
  /** The item tax rate in percentage. */
  taxRate: number | null;
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
    this.productCode = prediction["product_code"];
    this.quantity = +parseFloat(prediction["quantity"]).toFixed(3);
    if (isNaN(this.quantity)) {
      this.quantity = null;
    }
    this.taxAmount = +parseFloat(prediction["tax_amount"]).toFixed(3);
    if (isNaN(this.taxAmount)) {
      this.taxAmount = null;
    }
    this.taxRate = +parseFloat(prediction["tax_rate"]).toFixed(3);
    if (isNaN(this.taxRate)) {
      this.taxRate = null;
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
      productCode: this.productCode ?? "",
      quantity: this.quantity !== null ? floatToString(this.quantity) : "",
      taxAmount: this.taxAmount !== null ? floatToString(this.taxAmount) : "",
      taxRate: this.taxRate !== null ? floatToString(this.taxRate) : "",
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
      "Product code: " +
      printable.productCode +
      "Quantity: " +
      printable.quantity +
      "Tax Amount: " +
      printable.taxAmount +
      "Tax Rate (%): " +
      printable.taxRate +
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
      (printable.description.length > 33
        ? printable.description.substring(0, 33) + "..."
        : printable.description
      ).padEnd(36) +
      " | " +
      printable.productCode.padEnd(12) +
      " | " +
      printable.quantity.padEnd(8) +
      " | " +
      printable.taxAmount.padEnd(10) +
      " | " +
      printable.taxRate.padEnd(12) +
      " | " +
      printable.totalAmount.padEnd(12) +
      " | " +
      printable.unitPrice.padEnd(10) +
      " |"
    );
  }
}
