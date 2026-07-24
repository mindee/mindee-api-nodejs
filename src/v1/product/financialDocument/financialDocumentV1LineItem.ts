import { cleanAndTruncate, floatToString } from "@/v1/parsing/common/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * List of line item present on the document.
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
  /** The item unit of measure. */
  unitMeasure: string | null;
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
  polygon: Polygon = new Polygon();

  constructor({ prediction = {} }: StringDict) {
    this.description = prediction["description"];
    this.productCode = prediction["product_code"];
    this.quantity = FinancialDocumentV1LineItem.#parseNumber(prediction["quantity"]);
    this.taxAmount = FinancialDocumentV1LineItem.#parseNumber(prediction["tax_amount"]);
    this.taxRate = FinancialDocumentV1LineItem.#parseNumber(prediction["tax_rate"]);
    this.totalAmount = FinancialDocumentV1LineItem.#parseNumber(prediction["total_amount"]);
    this.unitMeasure = prediction["unit_measure"];
    this.unitPrice = FinancialDocumentV1LineItem.#parseNumber(prediction["unit_price"]);
    this.pageId = prediction["page_id"];
    this.confidence = prediction["confidence"] ? prediction.confidence : 0.0;
    if (prediction["polygon"]) {
      this.polygon = prediction.polygon;
    }
  }

  static #parseNumber(value: unknown): number | null {
    if (value === undefined || value === null || isNaN(value as number)) {
      return null;
    }
    return +parseFloat(value as string);
  }

  /**
   * Collection of fields as representable strings.
   */
  #printableValues() {
    return {
      description: cleanAndTruncate(this.description, 36),
      productCode: cleanAndTruncate(this.productCode, 12),
      quantity: this.quantity !== undefined ? floatToString(this.quantity) : "",
      taxAmount: this.taxAmount !== undefined ? floatToString(this.taxAmount) : "",
      taxRate: this.taxRate !== undefined ? floatToString(this.taxRate) : "",
      totalAmount:
        this.totalAmount !== undefined ? floatToString(this.totalAmount) : "",
      unitMeasure: cleanAndTruncate(this.unitMeasure, 15),
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
      ", Product code: " +
      printable.productCode +
      ", Quantity: " +
      printable.quantity +
      ", Tax Amount: " +
      printable.taxAmount +
      ", Tax Rate (%): " +
      printable.taxRate +
      ", Total Amount: " +
      printable.totalAmount +
      ", Unit of measure: " +
      printable.unitMeasure +
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
      printable.unitMeasure.padEnd(15) +
      " | " +
      printable.unitPrice.padEnd(10) +
      " |"
    );
  }
}
