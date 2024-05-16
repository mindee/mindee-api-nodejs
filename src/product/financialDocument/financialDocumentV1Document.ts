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
 * Financial Document API version 1.7 document data.
 */
export class FinancialDocumentV1Document implements Prediction {
  /** The customer's address used for billing. */
  billingAddress: StringField;
  /** The purchase category among predefined classes. */
  category: ClassificationField;
  /** The address of the customer. */
  customerAddress: StringField;
  /** List of company registrations associated to the customer. */
  customerCompanyRegistrations: CompanyRegistrationField[] = [];
  /** The customer account number or identifier from the supplier. */
  customerId: StringField;
  /** The name of the customer. */
  customerName: StringField;
  /** The date the purchase was made. */
  date: DateField;
  /** The document number or identifier. */
  documentNumber: StringField;
  /** One of: 'INVOICE', 'CREDIT NOTE', 'CREDIT CARD RECEIPT', 'EXPENSE RECEIPT'. */
  documentType: ClassificationField;
  /** The date on which the payment is due. */
  dueDate: DateField;
  /** The invoice number or identifier only if document is an invoice. */
  invoiceNumber: StringField;
  /** List of line item details. */
  lineItems: FinancialDocumentV1LineItem[] = [];
  /** The locale detected on the document. */
  locale: LocaleField;
  /** The receipt number or identifier only if document is a receipt. */
  receiptNumber: StringField;
  /** List of Reference numbers, including PO number. */
  referenceNumbers: StringField[] = [];
  /** The customer's address used for shipping. */
  shippingAddress: StringField;
  /** The purchase subcategory among predefined classes for transport and food. */
  subcategory: ClassificationField;
  /** The address of the supplier or merchant. */
  supplierAddress: StringField;
  /** List of company registrations associated to the supplier. */
  supplierCompanyRegistrations: CompanyRegistrationField[] = [];
  /** The email of the supplier or merchant. */
  supplierEmail: StringField;
  /** The name of the supplier or merchant. */
  supplierName: StringField;
  /** List of payment details associated to the supplier. */
  supplierPaymentDetails: PaymentDetailsField[] = [];
  /** The phone number of the supplier or merchant. */
  supplierPhoneNumber: StringField;
  /** The website URL of the supplier or merchant. */
  supplierWebsite: StringField;
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
    this.billingAddress = new StringField({
      prediction: rawPrediction["billing_address"],
      pageId: pageId,
    });
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
    this.customerId = new StringField({
      prediction: rawPrediction["customer_id"],
      pageId: pageId,
    });
    this.customerName = new StringField({
      prediction: rawPrediction["customer_name"],
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: rawPrediction["date"],
      pageId: pageId,
    });
    this.documentNumber = new StringField({
      prediction: rawPrediction["document_number"],
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
    this.receiptNumber = new StringField({
      prediction: rawPrediction["receipt_number"],
      pageId: pageId,
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
    this.shippingAddress = new StringField({
      prediction: rawPrediction["shipping_address"],
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
    this.supplierEmail = new StringField({
      prediction: rawPrediction["supplier_email"],
      pageId: pageId,
    });
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
    this.supplierWebsite = new StringField({
      prediction: rawPrediction["supplier_website"],
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
:Receipt Number: ${this.receiptNumber}
:Document Number: ${this.documentNumber}
:Reference Numbers: ${referenceNumbers}
:Purchase Date: ${this.date}
:Due Date: ${this.dueDate}
:Total Net: ${this.totalNet}
:Total Amount: ${this.totalAmount}
:Taxes: ${this.taxes}
:Supplier Payment Details: ${supplierPaymentDetails}
:Supplier Name: ${this.supplierName}
:Supplier Company Registrations: ${supplierCompanyRegistrations}
:Supplier Address: ${this.supplierAddress}
:Supplier Phone Number: ${this.supplierPhoneNumber}
:Customer Name: ${this.customerName}
:Supplier Website: ${this.supplierWebsite}
:Supplier Email: ${this.supplierEmail}
:Customer Company Registrations: ${customerCompanyRegistrations}
:Customer Address: ${this.customerAddress}
:Customer ID: ${this.customerId}
:Shipping Address: ${this.shippingAddress}
:Billing Address: ${this.billingAddress}
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
