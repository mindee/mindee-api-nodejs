import { Document, DocumentConstructorProps } from "../document";

import {
  BaseField,
  TaxField,
  PaymentDetails,
  Locale,
  Amount,
  Field,
  DateField,
  CompanyRegistration,
} from "../../fields";
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

export class InvoiceV3 extends Document {
  /** Total amount with the tax amount of the purchase. */
  locale!: Locale;
  /** The nature of the invoice. */
  documentType!: BaseField;
  /** The total amount with tax included. */
  totalIncl!: Amount;
  /** The creation date of the invoice. */
  date!: DateField;
  /** The due date of the invoice. */
  dueDate!: DateField;
  /** The created time of the invoice */
  time!: Field;
  /** The total tax. */
  totalTax!: Amount;
  /** The total amount without the tax value. */
  totalExcl!: Amount;
  /** The supplier name. */
  supplier!: Field;
  /** The supplier address. */
  supplierAddress!: Field;
  /** The invoice number. */
  invoiceNumber!: Field;
  /** The company regitration information. */
  companyRegistration: CompanyRegistration[] = [];
  /** The name of the customer. */
  customerName!: Field;
  /** The address of the customer. */
  customerAddress!: Field;
  /** The list of the taxes. */
  taxes: TaxField[] = [];
  /** The payment information. */
  paymentDetails: PaymentDetails[] = [];
  /** The company registration information for the customer. */
  customerCompanyRegistration: CompanyRegistration[] = [];

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
    this.totalIncl = new Amount({
      prediction: apiPrediction.total_incl,
      valueKey: "value",
      pageId: pageId,
    });
    this.totalTax = new Amount({
      prediction: { value: undefined, confidence: 0.0 },
      valueKey: "value",
      pageId: pageId,
    });
    this.totalExcl = new Amount({
      prediction: apiPrediction.total_excl,
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
    this.companyRegistration = apiPrediction.company_registration.map(
      function (prediction: { [index: string]: any }) {
        return new CompanyRegistration({
          prediction: prediction,
          pageId: pageId,
        });
      }
    );
    this.dueDate = new DateField({
      prediction: apiPrediction.due_date,
      pageId: pageId,
    });
    this.invoiceNumber = new Field({
      prediction: apiPrediction.invoice_number,
      pageId: pageId,
    });
    this.supplier = new Field({
      prediction: apiPrediction.supplier,
      pageId: pageId,
    });
    this.supplierAddress = new Field({
      prediction: apiPrediction.supplier_address,
      pageId: pageId,
    });
    this.customerName = new Field({
      prediction: apiPrediction.customer,
      pageId: pageId,
    });
    this.customerAddress = new Field({
      prediction: apiPrediction.customer_address,
      pageId: pageId,
    });
    apiPrediction.customer_company_registration.map(
      (prediction: { [index: string]: any }) =>
        this.customerCompanyRegistration.push(
          new CompanyRegistration({
            prediction: prediction,
            pageId: pageId,
          })
        )
    );
    apiPrediction.payment_details.map((prediction: { [index: string]: any }) =>
      this.paymentDetails.push(
        new PaymentDetails({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
  }

  toString(): string {
    const taxes = this.taxes.map((item) => item.toString()).join("\n       ");
    const paymentDetails = this.paymentDetails
      .map((item) => item.toString())
      .join("\n                 ");
    const customerCompanyRegistration = this.customerCompanyRegistration
      .map((item) => item.toString())
      .join("; ");
    const companyRegistration = this.companyRegistration
      .map((item) => item.toString())
      .join("; ");

    const outStr = `-----Invoice V3-----
Filename: ${this.filename}
Invoice number: ${this.invoiceNumber}
Total amount including taxes: ${this.totalIncl}
Total amount excluding taxes: ${this.totalExcl}
Invoice date: ${this.date}
Invoice due date: ${this.dueDate}
Supplier name: ${this.supplier}
Supplier address: ${this.supplierAddress}
Customer name: ${this.customerName}
Customer company registration: ${customerCompanyRegistration}
Customer address: ${this.customerAddress}
Payment details: ${paymentDetails}
Company numbers: ${companyRegistration}
Taxes: ${taxes}
Total taxes: ${this.totalTax}
Locale: ${this.locale}
----------------------
`;
    return InvoiceV3.cleanOutString(outStr);
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
