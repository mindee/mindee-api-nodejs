import { Document, DocumentConstructorProps } from "../document";

import {
  TaxField,
  PaymentDetails,
  Locale,
  Amount,
  TextField,
  DateField,
  CompanyRegistration,
  BaseField,
  StringDict,
} from "../../fields";
import { InvoiceLineItem } from "../invoice/invoiceLineItem";

export class FinancialDocumentV1 extends Document {
  /** Locale information. */
  locale!: Locale;
  /** The nature of the document. */
  documentType!: BaseField;
  /** List of Reference numbers including PO number. */
  referenceNumbers: TextField[] = [];
  /** The creation date of the invoice or the purchase date. */
  date!: DateField;
  /** The due date of the invoice. */
  dueDate!: DateField;
  /** The supplier name. */
  supplierName!: TextField;
  /** The supplier address. */
  supplierAddress!: TextField;
  /** The payment information. */
  supplierPaymentDetails: PaymentDetails[] = [];
  /** The supplier company registration information. */
  supplierCompanyRegistrations: CompanyRegistration[] = [];
  /** The invoice number. */
  invoiceNumber!: TextField;
  /** The name of the customer. */
  customerName!: TextField;
  /** The address of the customer. */
  customerAddress!: TextField;
  /** The company registration information for the customer. */
  customerCompanyRegistrations: CompanyRegistration[] = [];
  /** The list of the taxes. */
  taxes: TaxField[] = [];
  /** Line items details. */
  lineItems: InvoiceLineItem[] = [];
  /** The receipt category among predefined classes. */
  category!: TextField;
  /** The receipt sub-category among predefined classes. */
  subCategory!: TextField;
  /** Time as seen on the receipt in HH:MM format. */
  time!: TextField;
  /** Total amount of tip and gratuity. */
  tip!: Amount;
  /** total spent including taxes, discounts, fees, tips, and gratuity. */
  totalAmount!: Amount;
  /** Total amount of the purchase excluding taxes. */
  totalNet!: Amount;
  /** Total tax amount of the purchase. */
  totalTax!: Amount;

  constructor({
    prediction,
    orientation = undefined,
    extras = undefined,
    inputSource = undefined,
    fullText = undefined,
    pageId = undefined,
  }: DocumentConstructorProps) {
    super({
      inputSource: inputSource,
      pageId: pageId,
      orientation: orientation,
      fullText: fullText,
      extras: extras,
    });

    this.locale = new Locale({
      prediction: prediction.locale,
      valueKey: "language",
    });
    this.documentType = new BaseField({
      prediction: prediction.document_type,
      valueKey: "value",
    });
    this.referenceNumbers = prediction.reference_numbers.map(function (
      prediction: StringDict
    ) {
      return new TextField({
        prediction: prediction,
        pageId: pageId,
      });
    });
    this.totalAmount = new Amount({
      prediction: prediction.total_amount,
      valueKey: "value",
      pageId: pageId,
    });
    this.totalTax = new Amount({
      prediction: prediction.total_tax,
      valueKey: "value",
      pageId: pageId,
    });
    this.totalNet = new Amount({
      prediction: prediction.total_net,
      valueKey: "value",
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: prediction.date,
      pageId,
    });
    this.dueDate = new DateField({
      prediction: prediction.due_date,
      pageId: pageId,
    });
    this.invoiceNumber = new TextField({
      prediction: prediction.invoice_number,
      pageId: pageId,
    });
    this.supplierName = new TextField({
      prediction: prediction.supplier_name,
      pageId: pageId,
    });
    this.supplierAddress = new TextField({
      prediction: prediction.supplier_address,
      pageId: pageId,
    });
    this.supplierCompanyRegistrations =
      prediction.supplier_company_registrations.map(function (prediction: {
        [index: string]: any;
      }) {
        return new CompanyRegistration({
          prediction: prediction,
          pageId: pageId,
        });
      });
    this.customerName = new TextField({
      prediction: prediction.customer_name,
      pageId: pageId,
    });
    this.customerAddress = new TextField({
      prediction: prediction.customer_address,
      pageId: pageId,
    });
    prediction.customer_company_registrations.map((prediction: StringDict) =>
      this.customerCompanyRegistrations.push(
        new CompanyRegistration({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
    prediction.supplier_payment_details.map((prediction: StringDict) =>
      this.supplierPaymentDetails.push(
        new PaymentDetails({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
    prediction.line_items.map((prediction: StringDict) =>
      this.lineItems.push(
        new InvoiceLineItem({
          prediction: prediction,
        })
      )
    );
    this.tip = new Amount({
      prediction: prediction.tip,
      valueKey: "value",
      pageId: pageId,
    });
    this.category = new TextField({
      prediction: prediction.category,
      pageId: pageId,
    });
    this.subCategory = new TextField({
      prediction: prediction.subcategory,
      pageId: pageId,
    });
    this.time = new TextField({
      prediction: prediction.time,
      pageId: pageId,
    });
    prediction.taxes.map((taxPrediction: StringDict) =>
      this.taxes.push(
        new TaxField({
          prediction: taxPrediction,
          pageId: pageId,
          valueKey: "value",
          rateKey: "rate",
          codeKey: "code",
          baseKey: "base",
        })
      )
    );
  }

  toString(): string {
    const taxes = this.taxes.map((item) => item.toString()).join("\n       ");
    const referenceNumbers = this.referenceNumbers
      .map((item) => item.toString())
      .join(", ");
    const paymentDetails = this.supplierPaymentDetails
      .map((item) => item.toString())
      .join("\n                 ");
    const customerCompanyRegistration = this.customerCompanyRegistrations
      .map((item) => item.toString())
      .join("; ");
    const supplierCompanyRegistration = this.supplierCompanyRegistrations
      .map((item) => item.toString())
      .join("; ");
    let lineItems = "";
    if (this.lineItems.length > 0) {
      lineItems =
        "\n  Code           | QTY    | Price   | Amount   | Tax (Rate)       | Description\n  ";
      lineItems += this.lineItems.map((item) => item.toString()).join("\n  ");
    }

    const outStr = `----- Financial Document V1 -----
Filename: ${this.filename}
Document type: ${this.documentType}
Category: ${this.category}
Subcategory: ${this.subCategory}
Locale: ${this.locale}
Invoice number: ${this.invoiceNumber}
Reference numbers: ${referenceNumbers}
Date: ${this.date}
Due date: ${this.dueDate}
Time: ${this.time}
Supplier name: ${this.supplierName}
Supplier address: ${this.supplierAddress}
Supplier company registrations: ${supplierCompanyRegistration}
Supplier payment details: ${paymentDetails}
Customer name: ${this.customerName}
Customer address: ${this.customerAddress}
Customer company registrations: ${customerCompanyRegistration}
Tip: ${this.tip}
Taxes: ${taxes}
Total tax: ${this.totalTax}
Total net: ${this.totalNet}
Total amount: ${this.totalAmount}
Line Items: ${lineItems}
----------------------
`;
    return FinancialDocumentV1.cleanOutString(outStr);
  }
}
