import { Document, DocumentConstructorProps } from "../document";

import {
  ClassificationField,
  Taxes,
  PaymentDetails,
  Locale,
  Amount,
  TextField,
  DateField,
  CompanyRegistration,
  StringDict,
} from "../../fields";
import { InvoiceLineItem } from "./invoiceLineItem";
import {
  taxesAndTotalExclMatchTotalIncl,
  taxesMatchTotalExcl,
  taxesMatchTotalIncl,
} from "./checks";
import {
  reconstructTotalExcl,
  reconstructTotalIncl,
  reconstructTotalTax,
  reconstructTotalTaxFromTotals,
} from "./reconstruction";

/** Invoice V4 */
export class InvoiceV4 extends Document {
  /** Locale information. */
  locale: Locale;
  /** The nature of the invoice. */
  documentType: ClassificationField;
  /** List of Reference numbers including PO number. */
  referenceNumbers: TextField[] = [];
  /** The total amount with tax included. */
  totalAmount: Amount;
  /** The creation date of the invoice. */
  date: DateField;
  /** The due date of the invoice. */
  dueDate: DateField;
  /** The total tax. */
  totalTax: Amount;
  /** The total amount without the tax value. */
  totalNet: Amount;
  /** The supplier name. */
  supplierName: TextField;
  /** The supplier address. */
  supplierAddress: TextField;
  /** The payment information. */
  supplierPaymentDetails: PaymentDetails[] = [];
  /** The supplier company regitration information. */
  supplierCompanyRegistrations: CompanyRegistration[] = [];
  /** The invoice number. */
  invoiceNumber: TextField;
  /** The name of the customer. */
  customerName: TextField;
  /** The address of the customer. */
  customerAddress: TextField;
  /** The company registration information for the customer. */
  customerCompanyRegistrations: CompanyRegistration[] = [];
  /** The list of the taxes. */
  taxes: Taxes;
  /** Line items details. */
  lineItems: InvoiceLineItem[] = [];

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
    this.documentType = new ClassificationField({
      prediction: prediction.document_type,
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
      pageId: pageId,
    });
    this.totalTax = new Amount({
      prediction: { value: undefined, confidence: 0.0 },
      pageId: pageId,
    });
    this.totalNet = new Amount({
      prediction: prediction.total_net,
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: prediction.date,
      pageId,
    });
    this.taxes = new Taxes().init(prediction["taxes"], pageId);
    this.supplierCompanyRegistrations =
      prediction.supplier_company_registrations.map(function (prediction: {
        [index: string]: any;
      }) {
        return new CompanyRegistration({
          prediction: prediction,
          pageId: pageId,
        });
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
    this.#checklist();
    this.#reconstruct();
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
        "\n  Code           | QTY    | Price   | Amount   | Tax (Rate)       | Description\n  ";
      lineItems += this.lineItems.map((item) => item.toString()).join("\n  ");
    }

    const outStr = `Invoice V4 Prediction
=====================
:Filename: ${this.filename}
:Locale: ${this.locale}
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
    return InvoiceV4.cleanOutString(outStr);
  }

  #checklist() {
    this.checklist = {
      taxesMatchTotalIncl: taxesMatchTotalIncl(this),
      taxesMatchTotalExcl: taxesMatchTotalExcl(this),
      taxesAndTotalExclMatchTotalIncl: taxesAndTotalExclMatchTotalIncl(this),
    };
  }

  #reconstruct() {
    reconstructTotalTax(this);
    reconstructTotalExcl(this);
    reconstructTotalIncl(this);
    reconstructTotalTaxFromTotals(this);
  }
}
