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
import { IsFinancialDocumentBase } from "../common/financialDocument";

export class FinancialDocumentV1
  extends Document
  implements IsFinancialDocumentBase
{
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
  paymentDetails: PaymentDetails[] = [];
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
      prediction: { value: undefined, confidence: 0.0 },
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
    prediction.taxes.map((prediction: StringDict) =>
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
      prediction.supplier_company_registration.map(function (prediction: {
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
    prediction.customer_company_registration.map((prediction: StringDict) =>
      this.customerCompanyRegistrations.push(
        new CompanyRegistration({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
    prediction.payment_details.map((prediction: StringDict) =>
      this.paymentDetails.push(
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
    return FinancialDocumentV1.cleanOutString(getSummary(this));
  }
}

function getSummary(financialDocument: FinancialDocumentV1): string {
  const taxes = financialDocument.taxes
    .map((item) => item.toString())
    .join("\n       ");
  const referenceNumbers = financialDocument.referenceNumbers
    .map((item) => item.toString())
    .join(", ");
  const paymentDetails = financialDocument.paymentDetails
    .map((item) => item.toString())
    .join("\n                 ");
  const customerCompanyRegistration =
    financialDocument.customerCompanyRegistrations
      .map((item) => item.toString())
      .join("; ");
  const supplierCompanyRegistration =
    financialDocument.supplierCompanyRegistrations
      .map((item) => item.toString())
      .join("; ");
  let lineItems = "\n";
  if (financialDocument.lineItems.length > 0) {
    lineItems =
      "\n  Code           | QTY    | Price   | Amount   | Tax (Rate)       | Description\n  ";
    lineItems += financialDocument.lineItems
      .map((item) => item.toString())
      .join("\n  ");
  }

  const outStr = `----- Financial V1 -----
Document type: ${financialDocument.documentType}
Category: ${financialDocument.category}
Subcategory: ${financialDocument.subCategory}
Locale: ${financialDocument.locale}
Number: ${financialDocument.invoiceNumber}
Reference numbers: ${referenceNumbers}
Date: ${financialDocument.date}
Due date: ${financialDocument.dueDate}
Time: ${financialDocument.time}
Supplier name: ${financialDocument.supplierName}
Supplier address: ${financialDocument.supplierAddress}
Supplier company registrations: ${supplierCompanyRegistration}
Payment details: ${paymentDetails}
Customer name: ${financialDocument.customerName}
Customer company registrations: ${customerCompanyRegistration}
Customer address: ${financialDocument.customerAddress}
Tip: ${financialDocument.tip}
Taxes: ${taxes}
Total taxes: ${financialDocument.totalTax}
Total net: ${financialDocument.totalNet}
Total amount: ${financialDocument.totalAmount}
Line Items: ${lineItems}
----------------------
`;
  return FinancialDocumentV1.cleanOutString(outStr);
}
