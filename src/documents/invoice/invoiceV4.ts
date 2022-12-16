import { Document, DocumentConstructorProps } from "../document";

import {
  TaxField,
  PaymentDetails,
  Locale,
  Amount,
  Field,
  DateField,
  CompanyRegistration,
  BaseField,
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

export class InvoiceV4 extends Document {
  /** Locale information. */
  locale!: Locale;
  /** The nature of the invoice. */
  documentType!: BaseField;
  /** The total amount with tax included. */
  totalAmount!: Amount;
  /** The creation date of the invoice. */
  date!: DateField;
  /** The due date of the invoice. */
  dueDate!: DateField;
  /** The created time of the invoice */
  time!: Field;
  /** The total tax. */
  totalTax!: Amount;
  /** The total amount without the tax value. */
  totalNet!: Amount;
  /** The supplier name. */
  supplierName!: Field;
  /** The supplier address. */
  supplierAddress!: Field;
  /** The payment information. */
  supplierPaymentDetails: PaymentDetails[] = [];
  /** The supplier company regitration information. */
  supplierCompanyRegistrations: CompanyRegistration[] = [];
  /** The invoice number. */
  invoiceNumber!: Field;
  /** The name of the customer. */
  customerName!: Field;
  /** The address of the customer. */
  customerAddress!: Field;
  /** The company registration information for the customer. */
  customerCompanyRegistrations: CompanyRegistration[] = [];
  /** The list of the taxes. */
  taxes: TaxField[] = [];
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
    this.#initFromApiPrediction(prediction, pageId);
    this.#checklist();
    this.#reconstruct();
  }

  #initFromApiPrediction(apiPrediction: any, pageId?: number) {
    this.locale = new Locale({
      prediction: apiPrediction.locale,
      valueKey: "language",
    });
    this.documentType = new BaseField({
      prediction: apiPrediction.document_type,
      valueKey: "value",
    });
    this.totalAmount = new Amount({
      prediction: apiPrediction.total_amount,
      valueKey: "value",
      pageId: pageId,
    });
    this.totalTax = new Amount({
      prediction: { value: undefined, confidence: 0.0 },
      valueKey: "value",
      pageId: pageId,
    });
    this.totalNet = new Amount({
      prediction: apiPrediction.total_net,
      valueKey: "value",
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: apiPrediction.date,
      pageId,
    });
    apiPrediction.taxes.map((prediction: { [index: string]: any }) =>
      this.taxes.push(
        new TaxField({
          prediction: prediction,
          pageId: pageId,
          valueKey: "value",
          rateKey: "rate",
          codeKey: "code",
        })
      )
    );
    this.supplierCompanyRegistrations =
      apiPrediction.supplier_company_registrations.map(function (prediction: {
        [index: string]: any;
      }) {
        return new CompanyRegistration({
          prediction: prediction,
          pageId: pageId,
        });
      });
    this.dueDate = new DateField({
      prediction: apiPrediction.due_date,
      pageId: pageId,
    });
    this.invoiceNumber = new Field({
      prediction: apiPrediction.invoice_number,
      pageId: pageId,
    });
    this.supplierName = new Field({
      prediction: apiPrediction.supplier_name,
      pageId: pageId,
    });
    this.supplierAddress = new Field({
      prediction: apiPrediction.supplier_address,
      pageId: pageId,
    });
    this.customerName = new Field({
      prediction: apiPrediction.customer_name,
      pageId: pageId,
    });
    this.customerAddress = new Field({
      prediction: apiPrediction.customer_address,
      pageId: pageId,
    });
    apiPrediction.customer_company_registrations.map(
      (prediction: { [index: string]: any }) =>
        this.customerCompanyRegistrations.push(
          new CompanyRegistration({
            prediction: prediction,
            pageId: pageId,
          })
        )
    );
    apiPrediction.supplier_payment_details.map(
      (prediction: { [index: string]: any }) =>
        this.supplierPaymentDetails.push(
          new PaymentDetails({
            prediction: prediction,
            pageId: pageId,
          })
        )
    );
    apiPrediction.line_items.map((prediction: { [index: string]: any }) =>
      this.lineItems.push(
        new InvoiceLineItem({
          prediction: prediction,
        })
      )
    );
  }

  toString(): string {
    const taxes = this.taxes.map((item) => item.toString()).join("\n       ");
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

    const outStr = `----- Invoice V4 -----
Filename: ${this.filename}
Locale: ${this.locale}
Invoice number: ${this.invoiceNumber}
Invoice date: ${this.date}
Invoice due date: ${this.dueDate}
Supplier name: ${this.supplierName}
Supplier address: ${this.supplierAddress}
Supplier company registrations: ${companyRegistration}
Supplier payment details: ${paymentDetails}
Customer name: ${this.customerName}
Customer company registrations: ${customerCompanyRegistration}
Customer address: ${this.customerAddress}
Line Items: ${lineItems}
Taxes: ${taxes}
Total taxes: ${this.totalTax}
Total amount excluding taxes: ${this.totalNet}
Total amount including taxes: ${this.totalAmount}
----------------------
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
