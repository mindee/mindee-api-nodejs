import { cleanSpecialChars, floatToString } from "../../parsing/common";
import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

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
      prediction["tax_amount"] !== undefined &&
      prediction["tax_amount"] !== null &&
      !isNaN(prediction["tax_amount"])
    ) {
      this.taxAmount = +parseFloat(prediction["tax_amount"]);
    } else {
      this.taxAmount = null;
    }
    if (
      prediction["tax_rate"] !== undefined &&
      prediction["tax_rate"] !== null &&
      !isNaN(prediction["tax_rate"])
    ) {
      this.taxRate = +parseFloat(prediction["tax_rate"]);
    } else {
      this.taxRate = null;
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
    this.unitMeasure = prediction["unit_measure"];
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
      productCode: this.productCode ?
        this.productCode.length <= 12 ?
          cleanSpecialChars(this.productCode) :
          cleanSpecialChars(this.productCode).slice(0, 9) + "..." :
        "",
      quantity: this.quantity !== undefined ? floatToString(this.quantity) : "",
      taxAmount: this.taxAmount !== undefined ? floatToString(this.taxAmount) : "",
      taxRate: this.taxRate !== undefined ? floatToString(this.taxRate) : "",
      totalAmount:
        this.totalAmount !== undefined ? floatToString(this.totalAmount) : "",
      unitMeasure: this.unitMeasure ?
        this.unitMeasure.length <= 15 ?
          cleanSpecialChars(this.unitMeasure) :
          cleanSpecialChars(this.unitMeasure).slice(0, 12) + "..." :
        "",
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
