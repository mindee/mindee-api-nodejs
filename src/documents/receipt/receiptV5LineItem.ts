import { floatToString } from "../../fields/amount";
import { StringDict } from "../../fields";

/**
 * Full extraction of lines, including: description, quantity, unit price and total.
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
  }

  toString() {
    const description = this.description ?? "";
    const quantity = this.quantity !== null ? floatToString(this.quantity) : "";
    const totalAmount =
      this.totalAmount !== null ? floatToString(this.totalAmount) : "";
    const unitPrice =
      this.unitPrice !== null ? floatToString(this.unitPrice) : "";

    return (
      "| " +
      description.padEnd(36) +
      " | " +
      quantity.padEnd(8) +
      " | " +
      totalAmount.padEnd(12) +
      " | " +
      unitPrice.padEnd(10) +
      " |"
    );
  }
}
