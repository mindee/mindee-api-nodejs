import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "../../parsing/common";
import { ReceiptV5LineItem } from "./receiptV5LineItem";
import {
  AmountField,
  ClassificationField,
  CompanyRegistrationField,
  DateField,
  LocaleField,
  StringField,
  Taxes,
} from "../../parsing/standard";

/**
 * Receipt API version 5.3 document data.
 */
export class ReceiptV5Document implements Prediction {
  /** The purchase category among predefined classes. */
  category: ClassificationField;
  /** The date the purchase was made. */
  date: DateField;
  /** One of: 'CREDIT CARD RECEIPT', 'EXPENSE RECEIPT'. */
  documentType: ClassificationField;
  /** List of line item details. */
  lineItems: ReceiptV5LineItem[] = [];
  /** The locale detected on the document. */
  locale: LocaleField;
  /** The receipt number or identifier. */
  receiptNumber: StringField;
  /** The purchase subcategory among predefined classes for transport and food. */
  subcategory: ClassificationField;
  /** The address of the supplier or merchant. */
  supplierAddress: StringField;
  /** List of company registrations associated to the supplier. */
  supplierCompanyRegistrations: CompanyRegistrationField[] = [];
  /** The name of the supplier or merchant. */
  supplierName: StringField;
  /** The phone number of the supplier or merchant. */
  supplierPhoneNumber: StringField;
  /** List of tax lines information. */
  taxes: Taxes;
  /** The time the purchase was made. */
  time: StringField;
  /** The total amount of tip and gratuity. */
  tip: AmountField;
  /** The total amount paid: includes taxes, discounts, fees, tips, and gratuity. */
  totalAmount: AmountField;
  /** The net amount paid: does not include taxes, fees, and discounts. */
  totalNet: AmountField;
  /** The total amount of taxes. */
  totalTax: AmountField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.category = new ClassificationField({
      prediction: rawPrediction["category"],
    });
    this.date = new DateField({
      prediction: rawPrediction["date"],
      pageId: pageId,
    });
    this.documentType = new ClassificationField({
      prediction: rawPrediction["document_type"],
    });
    rawPrediction["line_items"] &&
      rawPrediction["line_items"].map(
        (itemPrediction: StringDict) =>
          this.lineItems.push(
            new ReceiptV5LineItem({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.locale = new LocaleField({
      prediction: rawPrediction["locale"],
    });
    this.receiptNumber = new StringField({
      prediction: rawPrediction["receipt_number"],
      pageId: pageId,
    });
    this.subcategory = new ClassificationField({
      prediction: rawPrediction["subcategory"],
    });
    this.supplierAddress = new StringField({
      prediction: rawPrediction["supplier_address"],
      pageId: pageId,
    });
    rawPrediction["supplier_company_registrations"] &&
      rawPrediction["supplier_company_registrations"].map(
        (itemPrediction: StringDict) =>
          this.supplierCompanyRegistrations.push(
            new CompanyRegistrationField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.supplierName = new StringField({
      prediction: rawPrediction["supplier_name"],
      pageId: pageId,
    });
    this.supplierPhoneNumber = new StringField({
      prediction: rawPrediction["supplier_phone_number"],
      pageId: pageId,
    });
    this.taxes = new Taxes().init(
      rawPrediction["taxes"], pageId
    );
    this.time = new StringField({
      prediction: rawPrediction["time"],
      pageId: pageId,
    });
    this.tip = new AmountField({
      prediction: rawPrediction["tip"],
      pageId: pageId,
    });
    this.totalAmount = new AmountField({
      prediction: rawPrediction["total_amount"],
      pageId: pageId,
    });
    this.totalNet = new AmountField({
      prediction: rawPrediction["total_net"],
      pageId: pageId,
    });
    this.totalTax = new AmountField({
      prediction: rawPrediction["total_tax"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const supplierCompanyRegistrations = this.supplierCompanyRegistrations.join("\n                                 ");
    let lineItemsSummary:string = "";
    if (this.lineItems && this.lineItems.length > 0) {
      const lineItemsColSizes:number[] = [38, 10, 14, 12];
      lineItemsSummary += "\n" + lineSeparator(lineItemsColSizes, "-") + "\n  ";
      lineItemsSummary += "| Description                          ";
      lineItemsSummary += "| Quantity ";
      lineItemsSummary += "| Total Amount ";
      lineItemsSummary += "| Unit Price ";
      lineItemsSummary += "|\n" + lineSeparator(lineItemsColSizes, "=");
      lineItemsSummary += this.lineItems.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(lineItemsColSizes, "-")
      ).join("");
    }
    const outStr = `:Expense Locale: ${this.locale}
:Purchase Category: ${this.category}
:Purchase Subcategory: ${this.subcategory}
:Document Type: ${this.documentType}
:Purchase Date: ${this.date}
:Purchase Time: ${this.time}
:Total Amount: ${this.totalAmount}
:Total Net: ${this.totalNet}
:Total Tax: ${this.totalTax}
:Tip and Gratuity: ${this.tip}
:Taxes: ${this.taxes}
:Supplier Name: ${this.supplierName}
:Supplier Company Registrations: ${supplierCompanyRegistrations}
:Supplier Address: ${this.supplierAddress}
:Supplier Phone Number: ${this.supplierPhoneNumber}
:Receipt Number: ${this.receiptNumber}
:Line Items: ${lineItemsSummary}`.trimEnd();
    return cleanOutString(outStr);
  }
}
