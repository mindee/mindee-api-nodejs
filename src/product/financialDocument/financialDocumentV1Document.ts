import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "../../parsing/common";
import { FinancialDocumentV1LineItem } from "./financialDocumentV1LineItem";
import {
  AmountField,
  ClassificationField,
  CompanyRegistrationField,
  DateField,
  LocaleField,
  PaymentDetailsField,
  StringField,
  Taxes,
} from "../../parsing/standard";

/**
 * Document data for Financial Document, API version 1.
 */
export class FinancialDocumentV1Document implements Prediction {
  /** The purchase category among predefined classes. */
  category: ClassificationField;
  /** The address of the customer. */
  customerAddress: StringField;
  /** List of company registrations associated to the customer. */
  customerCompanyRegistrations: CompanyRegistrationField[] = [];
  /** The name of the customer. */
  customerName: StringField;
  /** The date the purchase was made. */
  date: DateField;
  /** One of: 'INVOICE', 'CREDIT NOTE', 'CREDIT CARD RECEIPT', 'EXPENSE RECEIPT'. */
  documentType: ClassificationField;
  /** The date on which the payment is due. */
  dueDate: DateField;
  /** The invoice number or identifier. */
  invoiceNumber: StringField;
  /** List of line item details. */
  lineItems: FinancialDocumentV1LineItem[] = [];
  /** The locale detected on the document. */
  locale: LocaleField;
  /** List of Reference numbers, including PO number. */
  referenceNumbers: StringField[] = [];
  /** The purchase subcategory among predefined classes for transport and food. */
  subcategory: ClassificationField;
  /** The address of the supplier or merchant. */
  supplierAddress: StringField;
  /** List of company registrations associated to the supplier. */
  supplierCompanyRegistrations: CompanyRegistrationField[] = [];
  /** The name of the supplier or merchant. */
  supplierName: StringField;
  /** List of payment details associated to the supplier. */
  supplierPaymentDetails: PaymentDetailsField[] = [];
  /** The phone number of the supplier or merchant. */
  supplierPhoneNumber: StringField;
  /** List of tax lines information. */
  taxes: Taxes;
  /** The time the purchase was made. */
  time: StringField;
  /** The total amount of tip and gratuity */
  tip: AmountField;
  /** The total amount paid: includes taxes, tips, fees, and other charges. */
  totalAmount: AmountField;
  /** The net amount paid: does not include taxes, fees, and discounts. */
  totalNet: AmountField;
  /** The total amount of taxes. */
  totalTax: AmountField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.category = new ClassificationField({
      prediction: rawPrediction["category"],
    });
    this.customerAddress = new StringField({
      prediction: rawPrediction["customer_address"],
      pageId: pageId,
    });
    rawPrediction["customer_company_registrations"] &&
      rawPrediction["customer_company_registrations"].map(
        (itemPrediction: StringDict) =>
          this.customerCompanyRegistrations.push(
            new CompanyRegistrationField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.customerName = new StringField({
      prediction: rawPrediction["customer_name"],
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: rawPrediction["date"],
      pageId: pageId,
    });
    this.documentType = new ClassificationField({
      prediction: rawPrediction["document_type"],
    });
    this.dueDate = new DateField({
      prediction: rawPrediction["due_date"],
      pageId: pageId,
    });
    this.invoiceNumber = new StringField({
      prediction: rawPrediction["invoice_number"],
      pageId: pageId,
    });
    rawPrediction["line_items"] &&
      rawPrediction["line_items"].map(
        (itemPrediction: StringDict) =>
          this.lineItems.push(
            new FinancialDocumentV1LineItem({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.locale = new LocaleField({
      prediction: rawPrediction["locale"],
    });
    rawPrediction["reference_numbers"] &&
      rawPrediction["reference_numbers"].map(
        (itemPrediction: StringDict) =>
          this.referenceNumbers.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
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
    rawPrediction["supplier_payment_details"] &&
      rawPrediction["supplier_payment_details"].map(
        (itemPrediction: StringDict) =>
          this.supplierPaymentDetails.push(
            new PaymentDetailsField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
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

  toString(): string {
    const referenceNumbers = this.referenceNumbers.join("\n                    ");
    const supplierPaymentDetails = this.supplierPaymentDetails.join("\n                           ");
    const supplierCompanyRegistrations = this.supplierCompanyRegistrations.join("\n                                 ");
    const customerCompanyRegistrations = this.customerCompanyRegistrations.join("\n                                 ");
    let lineItemsSummary:string = "";
    if (this.lineItems && this.lineItems.length > 0) {
      const lineItemsColSizes:number[] = [38, 14, 10, 12, 14, 14, 12];
      lineItemsSummary += "\n" + lineSeparator(lineItemsColSizes, "-") + "\n  ";
      lineItemsSummary += "| Description                          ";
      lineItemsSummary += "| Product code ";
      lineItemsSummary += "| Quantity ";
      lineItemsSummary += "| Tax Amount ";
      lineItemsSummary += "| Tax Rate (%) ";
      lineItemsSummary += "| Total Amount ";
      lineItemsSummary += "| Unit Price ";
      lineItemsSummary += "|\n" + lineSeparator(lineItemsColSizes, "=");
      lineItemsSummary += this.lineItems.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(lineItemsColSizes, "-")
      ).join("");
    }
    const outStr = `:Locale: ${this.locale}
:Invoice Number: ${this.invoiceNumber}
:Reference Numbers: ${referenceNumbers}
:Purchase Date: ${this.date}
:Due Date: ${this.dueDate}
:Total Net: ${this.totalNet}
:Total Amount: ${this.totalAmount}
:Taxes: ${this.taxes}
:Supplier Payment Details: ${supplierPaymentDetails}
:Supplier name: ${this.supplierName}
:Supplier Company Registrations: ${supplierCompanyRegistrations}
:Supplier Address: ${this.supplierAddress}
:Supplier Phone Number: ${this.supplierPhoneNumber}
:Customer name: ${this.customerName}
:Customer Company Registrations: ${customerCompanyRegistrations}
:Customer Address: ${this.customerAddress}
:Document Type: ${this.documentType}
:Purchase Subcategory: ${this.subcategory}
:Purchase Category: ${this.category}
:Total Tax: ${this.totalTax}
:Tip and Gratuity: ${this.tip}
:Purchase Time: ${this.time}
:Line Items: ${lineItemsSummary}`.trimEnd();
    return cleanOutString(outStr);
  }
}
