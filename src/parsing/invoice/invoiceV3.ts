import { Document, DocumentConstructorProps } from "../document";

import {
  BaseField,
  Taxes,
  PaymentDetails,
  Locale,
  Amount,
  TextField,
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
  locale: Locale;
  /** The nature of the invoice. */
  documentType: BaseField;
  /** The total amount with tax included. Same as totalIncl. */
  totalAmount: Amount;
  /** The creation date of the invoice. */
  date: DateField;
  /** The due date of the invoice. */
  dueDate: DateField;
  /** The created time of the invoice */
  time!: TextField;
  /** The total tax. */
  totalTax: Amount;
  /** The total amount without the tax value. Same as totalExcl. */
  totalNet: Amount;
  /** The supplier name. */
  supplier: TextField;
  /** The supplier address. */
  supplierAddress: TextField;
  /** The invoice number. */
  invoiceNumber: TextField;
  /** The company regitration information. */
  companyRegistration: CompanyRegistration[] = [];
  /** The name of the customer. */
  customerName: TextField;
  /** The address of the customer. */
  customerAddress: TextField;
  /** The list of the taxes. */
  taxes: Taxes;
  /** The payment information. */
  paymentDetails: PaymentDetails[] = [];
  /** The company registration information for the customer. */
  customerCompanyRegistration: CompanyRegistration[] = [];

  /** The total amount without the tax value. */
  public get totalExcl(): Amount {
    return this.totalNet;
  }
  /** The total amount without the tax value. */
  public set totalExcl(value: Amount) {
    this.totalNet = value;
  }
  /** The total amount with tax included. */
  public get totalIncl(): Amount {
    return this.totalAmount;
  }
  /** The total amount with tax included. */
  public set totalIncl(value: Amount) {
    this.totalAmount = value;
  }

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
    });
    this.totalIncl = new Amount({
      prediction: prediction.total_incl,
      pageId: pageId,
    });
    this.totalAmount = this.totalIncl;
    this.totalTax = new Amount({
      prediction: { value: undefined, confidence: 0.0 },
      pageId: pageId,
    });
    this.totalNet = new Amount({
      prediction: prediction.total_excl,
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: prediction.date,
      pageId,
    });
    this.taxes = new Taxes().init(prediction["taxes"], pageId);
    this.companyRegistration = prediction.company_registration.map(
      function (prediction: { [index: string]: any }) {
        return new CompanyRegistration({
          prediction: prediction,
          pageId: pageId,
        });
      }
    );
    this.dueDate = new DateField({
      prediction: prediction.due_date,
      pageId: pageId,
    });
    this.invoiceNumber = new TextField({
      prediction: prediction.invoice_number,
      pageId: pageId,
    });
    this.supplier = new TextField({
      prediction: prediction.supplier,
      pageId: pageId,
    });
    this.supplierAddress = new TextField({
      prediction: prediction.supplier_address,
      pageId: pageId,
    });
    this.customerName = new TextField({
      prediction: prediction.customer,
      pageId: pageId,
    });
    this.customerAddress = new TextField({
      prediction: prediction.customer_address,
      pageId: pageId,
    });
    prediction.customer_company_registration.map(
      (prediction: { [index: string]: any }) =>
        this.customerCompanyRegistration.push(
          new CompanyRegistration({
            prediction: prediction,
            pageId: pageId,
          })
        )
    );
    prediction.payment_details.map((prediction: { [index: string]: any }) =>
      this.paymentDetails.push(
        new PaymentDetails({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
    this.#checklist();
    this.#reconstruct();
  }

  toString(): string {
    const paymentDetails = this.paymentDetails
      .map((item) => item.toString())
      .join("\n                 ");
    const customerCompanyRegistration = this.customerCompanyRegistration
      .map((item) => item.toString())
      .join("; ");
    const companyRegistration = this.companyRegistration
      .map((item) => item.toString())
      .join("; ");

    const outStr = `Invoice V3 Prediction
=====================
:Filename: ${this.filename}
:Invoice number: ${this.invoiceNumber}
:Total amount: ${this.totalIncl}
:Total net: ${this.totalExcl}
:Invoice date: ${this.date}
:Invoice due date: ${this.dueDate}
:Supplier name: ${this.supplier}
:Supplier address: ${this.supplierAddress}
:Customer name: ${this.customerName}
:Customer company registration: ${customerCompanyRegistration}
:Customer address: ${this.customerAddress}
:Payment details: ${paymentDetails}
:Company numbers: ${companyRegistration}
:Taxes: ${this.taxes}
:Total tax: ${this.totalTax}
:Locale: ${this.locale}
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
