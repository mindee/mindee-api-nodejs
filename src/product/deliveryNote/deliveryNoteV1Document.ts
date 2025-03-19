import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../parsing/common";
import {
  AmountField,
  DateField,
  StringField,
} from "../../parsing/standard";

/**
 * Delivery note API version 1.2 document data.
 */
export class DeliveryNoteV1Document implements Prediction {
  /** The address of the customer receiving the goods. */
  customerAddress: StringField;
  /** The name of the customer receiving the goods. */
  customerName: StringField;
  /** The date on which the delivery is scheduled to arrive. */
  deliveryDate: DateField;
  /** A unique identifier for the delivery note. */
  deliveryNumber: StringField;
  /** The address of the supplier providing the goods. */
  supplierAddress: StringField;
  /** The name of the supplier providing the goods. */
  supplierName: StringField;
  /** The total monetary value of the goods being delivered. */
  totalAmount: AmountField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.customerAddress = new StringField({
      prediction: rawPrediction["customer_address"],
      pageId: pageId,
    });
    this.customerName = new StringField({
      prediction: rawPrediction["customer_name"],
      pageId: pageId,
    });
    this.deliveryDate = new DateField({
      prediction: rawPrediction["delivery_date"],
      pageId: pageId,
    });
    this.deliveryNumber = new StringField({
      prediction: rawPrediction["delivery_number"],
      pageId: pageId,
    });
    this.supplierAddress = new StringField({
      prediction: rawPrediction["supplier_address"],
      pageId: pageId,
    });
    this.supplierName = new StringField({
      prediction: rawPrediction["supplier_name"],
      pageId: pageId,
    });
    this.totalAmount = new AmountField({
      prediction: rawPrediction["total_amount"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const outStr = `:Delivery Date: ${this.deliveryDate}
:Delivery Number: ${this.deliveryNumber}
:Supplier Name: ${this.supplierName}
:Supplier Address: ${this.supplierAddress}
:Customer Name: ${this.customerName}
:Customer Address: ${this.customerAddress}
:Total Amount: ${this.totalAmount}`.trimEnd();
    return cleanOutString(outStr);
  }
}
