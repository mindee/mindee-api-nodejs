import { cleanOutString } from "src/parsing/common/summaryHelper";
import {
  Prediction,
  StringDict,
} from "../../parsing/common";
import {
  ClassificationField,
  Taxes,
  PaymentDetailsField,
  LocaleField,
  AmountField,
  StringField,
  DateField,
  CompanyRegistrationField,
} from "../../parsing/standard";
import { InvoiceLineItem } from "./invoiceLineItem";

/** Invoice V4 */
export class InvoiceV4Document implements Prediction {
  /** LocaleField information. */
  locale: LocaleField;
  /** The nature of the invoice. */
  documentType: ClassificationField;
  /** List of Reference numbers including PO number. */
  referenceNumbers: StringField[] = [];
  /** The total amount with tax included. */
  totalAmount: AmountField;
  /** The creation date of the invoice. */
  date: DateField;
  /** The due date of the invoice. */
  dueDate: DateField;
  /** The total tax. */
  totalTax: AmountField;
  /** The total amount without the tax value. */
  totalNet: AmountField;
  /** The supplier name. */
  supplierName: StringField;
  /** The supplier address. */
  supplierAddress: StringField;
  /** The payment information. */
  supplierPaymentDetails: PaymentDetailsField[] = [];
  /** The supplier company regitration information. */
  supplierCompanyRegistrations: CompanyRegistrationField[] = [];
  /** The invoice number. */
  invoiceNumber: StringField;
  /** The name of the customer. */
  customerName: StringField;
  /** The address of the customer. */
  customerAddress: StringField;
  /** The company registration information for the customer. */
  customerCompanyRegistrations: CompanyRegistrationField[] = [];
  /** The list of the taxes. */
  taxes: Taxes;
  /** Line items details. */
  lineItems: InvoiceLineItem[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.locale = new LocaleField({
      prediction: rawPrediction.locale,
      valueKey: "language",
    });
    this.documentType = new ClassificationField({
      prediction: rawPrediction.document_type,
    });
    this.referenceNumbers = rawPrediction.reference_numbers.map(function (
      prediction: StringDict
    ) {
      return new StringField({
        prediction: prediction,
        pageId: pageId,
      });
    });
    this.totalAmount = new AmountField({
      prediction: rawPrediction.total_amount,
      pageId: pageId,
    });
    this.totalTax = new AmountField({
      prediction: { value: undefined, confidence: 0.0 },
      pageId: pageId,
    });
    this.totalNet = new AmountField({
      prediction: rawPrediction.total_net,
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: rawPrediction.date,
      pageId,
    });
    this.taxes = new Taxes().init(rawPrediction["taxes"], pageId);
    this.supplierCompanyRegistrations =
      rawPrediction.supplier_company_registrations.map(function (prediction: {
        [index: string]: any;
      }) {
        return new CompanyRegistrationField({
          prediction: prediction,
          pageId: pageId,
        });
      });
    this.dueDate = new DateField({
      prediction: rawPrediction.due_date,
      pageId: pageId,
    });
    this.invoiceNumber = new StringField({
      prediction: rawPrediction.invoice_number,
      pageId: pageId,
    });
    this.supplierName = new StringField({
      prediction: rawPrediction.supplier_name,
      pageId: pageId,
    });
    this.supplierAddress = new StringField({
      prediction: rawPrediction.supplier_address,
      pageId: pageId,
    });
    this.customerName = new StringField({
      prediction: rawPrediction.customer_name,
      pageId: pageId,
    });
    this.customerAddress = new StringField({
      prediction: rawPrediction.customer_address,
      pageId: pageId,
    });
    rawPrediction.customer_company_registrations.map((prediction: StringDict) =>
      this.customerCompanyRegistrations.push(
        new CompanyRegistrationField({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
    rawPrediction.supplier_payment_details.map((prediction: StringDict) =>
      this.supplierPaymentDetails.push(
        new PaymentDetailsField({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
    rawPrediction.line_items.map((prediction: StringDict) =>
      this.lineItems.push(
        new InvoiceLineItem({
          prediction: prediction,
        })
      )
    );
  }

  toString(): string {
    const referenceNumbers = this.referenceNumbers
      .map((item) => item.toString())
      .join(", ");
    const paymentDetails = this.supplierPaymentDetails
      .map((item) => item.toString())
      .join("\n                 ");
    const customerCompanyRegistration = this.customerCompanyRegistrations
      .map((item) => item.toString())
      .join("; ");
    const companyRegistration = this.supplierCompanyRegistrations
      .map((item) => item.toString())
      .join("; ");
    let lineItems = "\n";
    if (this.lineItems.length > 0) {
      lineItems =
        "\n  Code           | QTY    | Price   | AmountField   | Tax (Rate)       | Description\n  ";
      lineItems += this.lineItems.map((item) => item.toString()).join("\n  ");
    }

    const outStr = `
:LocaleField: ${this.locale}
:Invoice number: ${this.invoiceNumber}
:Reference numbers: ${referenceNumbers}
:Invoice date: ${this.date}
:Invoice due date: ${this.dueDate}
:Supplier name: ${this.supplierName}
:Supplier address: ${this.supplierAddress}
:Supplier company registrations: ${companyRegistration}
:Supplier payment details: ${paymentDetails}
:Customer name: ${this.customerName}
:Customer company registrations: ${customerCompanyRegistration}
:Customer address: ${this.customerAddress}
:Line Items: ${lineItems}
:Taxes: ${this.taxes}
:Total tax: ${this.totalTax}
:Total net: ${this.totalNet}
:Total amount: ${this.totalAmount}
`;
    return cleanOutString(outStr);
  }
}
