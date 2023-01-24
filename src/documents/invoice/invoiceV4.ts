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
import { IsFinancialDocumentBase } from "../common/financialDocument";

export interface IsInvoiceV4 extends IsFinancialDocumentBase {
  /** List of Reference numbers including PO number. */
  referenceNumbers: TextField[];
  /** The due date of the invoice. */
  dueDate: DateField;
  /** The supplier name. */
  supplierName: TextField;
  /** The supplier address. */
  supplierAddress: TextField;
  /** The payment information. */
  supplierPaymentDetails: PaymentDetails[];
  /** The supplier company regitration information. */
  supplierCompanyRegistrations: CompanyRegistration[];
  /** The invoice number. */
  invoiceNumber: TextField;
  /** The name of the customer. */
  customerName: TextField;
  /** The address of the customer. */
  customerAddress: TextField;
  /** The company registration information for the customer. */
  customerCompanyRegistrations: CompanyRegistration[];
  /** Line items details. */
  lineItems: InvoiceLineItem[];
}

export class InvoiceV4 extends Document {
  /** Locale information. */
  locale!: Locale;
  /** The nature of the invoice. */
  documentType!: BaseField;
  /** List of Reference numbers including PO number. */
  referenceNumbers: TextField[] = [];
  /** The total amount with tax included. */
  totalAmount!: Amount;
  /** The creation date of the invoice. */
  date!: DateField;
  /** The due date of the invoice. */
  dueDate!: DateField;
  /** The total tax. */
  totalTax!: Amount;
  /** The total amount without the tax value. */
  totalNet!: Amount;
  /** The supplier name. */
  supplierName!: TextField;
  /** The supplier address. */
  supplierAddress!: TextField;
  /** The payment information. */
  supplierPaymentDetails: PaymentDetails[] = [];
  /** The supplier company regitration information. */
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
    buildInvoiceV4(this, prediction, pageId);
    this.#checklist();
    reconstruct(this);
  }

  toString(): string {
    return getInvoiceV4Summary(this);
  }

  #checklist() {
    this.checklist = {
      taxesMatchTotalIncl: taxesMatchTotalIncl(this),
      taxesMatchTotalExcl: taxesMatchTotalExcl(this),
      taxesAndTotalExclMatchTotalIncl: taxesAndTotalExclMatchTotalIncl(this),
    };
  }
}

function reconstruct(invoice: IsInvoiceV4) {
  reconstructTotalTax(invoice);
  reconstructTotalExcl(invoice);
  reconstructTotalIncl(invoice);
  reconstructTotalTaxFromTotals(invoice);
}

export function buildInvoiceV4(
  invoice: IsInvoiceV4,
  apiPrediction: StringDict,
  pageId: number | undefined
): void {
  invoice.locale = new Locale({
    prediction: apiPrediction.locale,
    valueKey: "language",
  });
  invoice.documentType = new BaseField({
    prediction: apiPrediction.document_type,
    valueKey: "value",
  });
  invoice.referenceNumbers = apiPrediction.reference_numbers.map(function (
    prediction: StringDict
  ) {
    return new TextField({
      prediction: prediction,
      pageId: pageId,
    });
  });
  invoice.totalAmount = new Amount({
    prediction: apiPrediction.total_amount,
    valueKey: "value",
    pageId: pageId,
  });
  invoice.totalTax = new Amount({
    prediction: { value: undefined, confidence: 0.0 },
    valueKey: "value",
    pageId: pageId,
  });
  invoice.totalNet = new Amount({
    prediction: apiPrediction.total_net,
    valueKey: "value",
    pageId: pageId,
  });
  invoice.date = new DateField({
    prediction: apiPrediction.date,
    pageId,
  });
  apiPrediction.taxes.map((prediction: StringDict) =>
    invoice.taxes.push(
      new TaxField({
        prediction: prediction,
        pageId: pageId,
        valueKey: "value",
        rateKey: "rate",
        codeKey: "code",
      })
    )
  );
  invoice.supplierCompanyRegistrations =
    apiPrediction.supplier_company_registrations.map(function (prediction: {
      [index: string]: any;
    }) {
      return new CompanyRegistration({
        prediction: prediction,
        pageId: pageId,
      });
    });
  invoice.dueDate = new DateField({
    prediction: apiPrediction.due_date,
    pageId: pageId,
  });
  invoice.invoiceNumber = new TextField({
    prediction: apiPrediction.invoice_number,
    pageId: pageId,
  });
  invoice.supplierName = new TextField({
    prediction: apiPrediction.supplier_name,
    pageId: pageId,
  });
  invoice.supplierAddress = new TextField({
    prediction: apiPrediction.supplier_address,
    pageId: pageId,
  });
  invoice.customerName = new TextField({
    prediction: apiPrediction.customer_name,
    pageId: pageId,
  });
  invoice.customerAddress = new TextField({
    prediction: apiPrediction.customer_address,
    pageId: pageId,
  });
  apiPrediction.customer_company_registrations.map((prediction: StringDict) =>
    invoice.customerCompanyRegistrations.push(
      new CompanyRegistration({
        prediction: prediction,
        pageId: pageId,
      })
    )
  );
  apiPrediction.supplier_payment_details.map((prediction: StringDict) =>
    invoice.supplierPaymentDetails.push(
      new PaymentDetails({
        prediction: prediction,
        pageId: pageId,
      })
    )
  );
  apiPrediction.line_items.map((prediction: StringDict) =>
    invoice.lineItems.push(
      new InvoiceLineItem({
        prediction: prediction,
      })
    )
  );
}

export function getInvoiceV4Summary(invoice: IsInvoiceV4): string {
  const taxes = invoice.taxes.map((item) => item.toString()).join("\n       ");
  const referenceNumbers = invoice.referenceNumbers
    .map((item) => item.toString())
    .join(", ");
  const paymentDetails = invoice.supplierPaymentDetails
    .map((item) => item.toString())
    .join("\n                 ");
  const customerCompanyRegistration = invoice.customerCompanyRegistrations
    .map((item) => item.toString())
    .join("; ");
  const companyRegistration = invoice.supplierCompanyRegistrations
    .map((item) => item.toString())
    .join("; ");
  let lineItems = "\n";
  if (invoice.lineItems.length > 0) {
    lineItems =
      "\n  Code           | QTY    | Price   | Amount   | Tax (Rate)       | Description\n  ";
    lineItems += invoice.lineItems.map((item) => item.toString()).join("\n  ");
  }

  const outStr = `----- Invoice V4 -----
Locale: ${invoice.locale}
Invoice number: ${invoice.invoiceNumber}
Reference numbers: ${referenceNumbers}
Invoice date: ${invoice.date}
Invoice due date: ${invoice.dueDate}
Supplier name: ${invoice.supplierName}
Supplier address: ${invoice.supplierAddress}
Supplier company registrations: ${companyRegistration}
Supplier payment details: ${paymentDetails}
Customer name: ${invoice.customerName}
Customer company registrations: ${customerCompanyRegistration}
Customer address: ${invoice.customerAddress}
Line Items: ${lineItems}
Taxes: ${taxes}
Total taxes: ${invoice.totalTax}
Total amount excluding taxes: ${invoice.totalNet}
Total amount including taxes: ${invoice.totalAmount}
----------------------
`;
  return InvoiceV4.cleanOutString(outStr);
}
