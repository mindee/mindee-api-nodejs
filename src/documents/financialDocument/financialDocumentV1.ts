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
} from "../../fields";
import { InvoiceLineItem } from "../invoice/invoiceLineItem";
import {
  IsReceiptV4,
  buildReceiptV4,
  getReceiptV4Summary,
} from "../receipt/receiptV4";
import {
  IsInvoiceV4,
  buildInvoiceV4,
  getInvoiceV4Summary,
} from "../invoice/invoiceV4";

export class FinancialDocumentV1
  extends Document
  implements IsReceiptV4, IsInvoiceV4
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
  /** The receipt category among predefined classes. */
  category!: TextField;
  /** The receipt sub-category among predefined classes. */
  subCategory!: TextField;
  /** The name of the supplier or merchant, as seen on the receipt. */
  supplier!: TextField;
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

    if (prediction.document_type.value === "INVOICE") {
      buildInvoiceV4(this, prediction, pageId);
    } else {
      buildReceiptV4(this, prediction, pageId);
    }
  }

  toString(): string {
    if (this.documentType.value === "INVOICE") {
      return getInvoiceV4Summary(this);
    }

    return getReceiptV4Summary(this);
  }
}
