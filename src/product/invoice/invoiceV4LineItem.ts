import { floatToString } from "../../parsing/standard";
import { Polygon } from "../../geometry";
import { StringDict } from "../../parsing/common";

export class InvoiceV4LineItem {
  /** The product code referring to the item. */
  productCode: string;
  /** The item description. */
  description: string;
  /** The item quantity  */
  quantity: number | undefined;
  /** The item unit price. */
  unitPrice: number | undefined;
  /** The item total amount. */
  totalAmount: number | undefined;
  /** The item tax rate in percentage. */
  taxRate: number | undefined;
  /** The item tax amount. */
  taxAmount: number | undefined;
  /** Confidence score */
  confidence: number = 0.0;
  /** The document page on which the information was found. */
  pageId: number;
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon = [];

  constructor(rawPrediction: StringDict) {
    this.productCode = rawPrediction["product_code"];
    this.description =
      rawPrediction["description"] !== undefined
        ? rawPrediction["description"]
        : "";
    this.quantity = +parseFloat(rawPrediction["quantity"]).toFixed(3);
    if (isNaN(this.quantity)) {
      this.quantity = undefined;
    }
    this.unitPrice = +parseFloat(rawPrediction["unit_price"]).toFixed(3);
    if (isNaN(this.unitPrice)) {
      this.unitPrice = undefined;
    }
    this.totalAmount = +parseFloat(rawPrediction["total_amount"]).toFixed(3);
    if (isNaN(this.totalAmount)) {
      this.totalAmount = undefined;
    }
    this.taxRate = +parseFloat(rawPrediction["tax_rate"]).toFixed(3);
    if (isNaN(this.taxRate)) {
      this.taxRate = undefined;
    }
    this.taxAmount = +parseFloat(rawPrediction["tax_amount"]).toFixed(3);
    if (isNaN(this.taxAmount)) {
      this.taxAmount = undefined;
    }
    this.pageId = rawPrediction["page_id"];
    this.confidence = rawPrediction["confidence"]
      ? rawPrediction["confidence"]
      : 0.0;
    if (rawPrediction["polygon"]) {
      this.polygon = rawPrediction["polygon"];
    }
  }

  #printableValues() {
    return {
      productCode: this.productCode ?? "",
      quantity: this.quantity !== undefined ? floatToString(this.quantity) : "",
      unitPrice:
        this.unitPrice !== undefined ? floatToString(this.unitPrice) : "",
      totalAmount:
        this.totalAmount !== undefined ? floatToString(this.totalAmount) : "",
      tax:
        (this.taxAmount !== undefined ? floatToString(this.taxAmount) : "") +
        (this.taxRate !== undefined
          ? " (" + floatToString(this.taxRate) + "%)"
          : ""),
      description:
        this.description.length > 33
          ? this.description.substring(0, 33) + "..."
          : this.description,
    };
  }

  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.productCode.padEnd(20) +
      " | " +
      printable.quantity.padEnd(7) +
      " | " +
      printable.unitPrice.padEnd(7) +
      " | " +
      printable.totalAmount.padEnd(8) +
      " | " +
      printable.tax.padEnd(16) +
      " | " +
      printable.description.padEnd(36) +
      " |"
    );
  }

  toString(): string {
    const printable = this.#printableValues();
    return (
      "Code: " +
      printable.productCode +
      ", Quantity: " +
      printable.quantity +
      ", Price: " +
      printable.unitPrice +
      ", Amount: " +
      printable.totalAmount +
      ", Tax (Rate): " +
      printable.tax +
      " Description: " +
      printable.description
    ).trim();
  }
}
