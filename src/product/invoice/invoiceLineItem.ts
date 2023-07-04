import { StringDict, floatToString } from "../../parsing/standard";
import { Polygon } from "../../geometry";
import { StringDict } from "../../parsing/common";

export class InvoiceLineItem {
  /** The product code referring to the item. */
  productCode: string;
  /** The item description. */
  description: string;
  /** The item quantity  */
  quantity: number | null;
  /** The item unit price. */
  unitPrice: number | null;
  /** The item total amount. */
  totalAmount: number | null;
  /** The item tax rate in percentage. */
  taxRate: number | null;
  /** The item tax amount. */
  taxAmount: number | null;
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
    this.productCode = prediction.product_code;
    this.description = prediction.description;
    this.quantity = +parseFloat(prediction.quantity).toFixed(3);
    if (isNaN(this.quantity)) {
      this.quantity = null;
    }
    this.unitPrice = +parseFloat(prediction.unit_price).toFixed(3);
    if (isNaN(this.unitPrice)) {
      this.unitPrice = null;
    }
    this.totalAmount = +parseFloat(prediction.total_amount).toFixed(3);
    if (isNaN(this.totalAmount)) {
      this.totalAmount = null;
    }
    this.taxRate = +parseFloat(prediction.tax_rate).toFixed(3);
    if (isNaN(this.taxRate)) {
      this.taxRate = null;
    }
    this.taxAmount = +parseFloat(prediction.tax_amount).toFixed(3);
    if (isNaN(this.taxAmount)) {
      this.taxAmount = null;
    }
    this.pageId = prediction.page_id;
    this.confidence = prediction.confidence ? prediction.confidence : 0.0;
    if (prediction.polygon) {
      this.polygon = prediction.polygon;
    }
  }

  toString(): string {
    const productCode = this.productCode ?? "";
    const quantity = this.quantity !== null ? floatToString(this.quantity) : "";
    const unitPrice =
      this.unitPrice !== null ? floatToString(this.unitPrice) : "";
    const totalAmount =
      this.totalAmount !== null ? floatToString(this.totalAmount) : "";
    let tax = this.taxAmount !== null ? floatToString(this.taxAmount) : "";
    tax += this.taxRate !== null ? ` (${floatToString(this.taxRate)}%)` : "";
    let description = this.description ?? "";
    if (description.length > 32) {
      description = this.description.substring(0, 32) + "...";
    }

    return (
      productCode.padEnd(14) +
      " | " +
      quantity.padEnd(6) +
      " | " +
      unitPrice.padEnd(7) +
      " | " +
      totalAmount.padEnd(8) +
      " | " +
      tax.padEnd(16) +
      " | " +
      description
    );
  }
}
