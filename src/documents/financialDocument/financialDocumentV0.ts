import { Document, DocumentConstructorProps } from "../document";
import { InvoiceV3 } from "../invoice/invoiceV3";
import { ReceiptV3 } from "../receipt/receiptV3";
import {
  TaxField,
  TextField,
  Amount,
  Locale,
  DateField as Date,
  CompanyRegistration,
} from "../../fields";

/**
 * @deprecated You should use FinancialDocumentV1 instead.
 */
export class FinancialDocumentV0 extends Document {
  pageId: number | undefined;
  locale!: Locale;
  totalIncl!: Amount;
  date!: Date;
  dueDate!: Date;
  category!: TextField;
  time!: TextField;
  taxes: TaxField[] = [];
  totalTax!: Amount;
  totalExcl!: Amount;
  supplier!: TextField;
  supplierAddress!: TextField;
  invoiceNumber!: TextField;
  companyRegistration: CompanyRegistration[] = [];
  customerName!: TextField;
  customerAddress!: TextField;
  paymentDetails: TextField[] = [];
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
    this.#initFromApiPrediction(
      prediction,
      inputSource,
      pageId,
      orientation,
      extras
    );
    this.#checklist();
  }

  #initFromApiPrediction(
    prediction: any,
    inputFile: any,
    pageNumber: number | undefined,
    orientation: any,
    extras: any
  ) {
    if (Object.keys(prediction).includes("invoice_number")) {
      const invoice = new InvoiceV3({
        prediction: prediction,
        inputSource: inputFile,
        pageId: pageNumber,
        orientation: orientation,
        extras: extras,
      });
      this.locale = invoice.locale;
      this.totalIncl = invoice.totalIncl;
      this.totalExcl = invoice.totalExcl;
      this.date = invoice.date;
      this.invoiceNumber = invoice.invoiceNumber;
      this.dueDate = invoice.dueDate;
      this.taxes = invoice.taxes;
      this.supplier = invoice.supplier;
      this.supplierAddress = invoice.supplierAddress;
      this.paymentDetails = invoice.paymentDetails;
      this.companyRegistration = invoice.customerCompanyRegistration;
      this.orientation = invoice.orientation;
      this.totalTax = invoice.totalTax;
      this.time = new TextField({
        prediction: { value: undefined, confidence: 0.0 },
      });
      this.customerName = invoice.customerName;
      this.customerAddress = invoice.customerAddress;
      this.customerCompanyRegistration = invoice.customerCompanyRegistration;
    } else {
      const receipt = new ReceiptV3({
        prediction: prediction,
        inputSource: inputFile,
        pageId: pageNumber,
        orientation: orientation,
        extras: extras,
      });
      this.orientation = receipt.orientation;
      this.date = receipt.date;
      this.dueDate = receipt.date;
      this.taxes = receipt.taxes;
      this.locale = receipt.locale;
      this.totalIncl = receipt.totalIncl;
      this.totalExcl = receipt.totalExcl;
      this.supplier = receipt.merchantName;
      this.supplierAddress = new TextField({
        prediction: { value: undefined, confidence: 0.0 },
      });
      this.time = receipt.time;
      this.totalTax = receipt.totalTax;
      this.invoiceNumber = new TextField({
        prediction: { value: undefined, confidence: 0.0 },
      });
      this.customerName = new TextField({
        prediction: { value: undefined, confidence: 0.0 },
      });
      this.customerAddress = new TextField({
        prediction: { value: undefined, confidence: 0.0 },
      });
    }
  }

  toString(): string {
    const outStr = `-----Financial document-----
Filename: ${this.filename}
Total amount: ${(this.totalIncl as Amount).value}
Date: ${(this.date as Date).value}
Supplier: ${(this.supplier as TextField).value}
Total taxes: ${(this.totalTax as Amount).value}
----------------------
`;
    return FinancialDocumentV0.cleanOutString(outStr);
  }

  #checklist() {
    this.checklist = {
      taxesMatchTotalIncl: this.#taxesMatchTotalIncl(),
    };
  }

  #taxesMatchTotalIncl() {
    // Check taxes and total include exist
    if (this.taxes.length === 0 || this.totalIncl.value === undefined)
      return false;

    // Reconstruct totalIncl from taxes
    let totalVat = 0;
    let reconstructedTotal = 0;
    this.taxes.forEach((tax) => {
      if (tax.value === undefined || !tax.rate) return false;
      totalVat += tax.value;
      reconstructedTotal += tax.value + (100 * tax.value) / tax.rate;
    });

    // Sanity check
    if (totalVat <= 0) return false;

    // Crate epsilon
    const eps = 1 / (100 * totalVat);

    if (
      this.totalIncl.value * (1 - eps) - 0.02 <= reconstructedTotal &&
      reconstructedTotal <= this.totalIncl.value * (1 + eps) + 0.02
    ) {
      this.taxes = (this.taxes as any[]).map((tax: any) => ({
        ...tax,
        confidence: 1.0,
      }));
      this.totalTax.confidence = 1.0;
      this.totalIncl.confidence = 1.0;
      return true;
    }
    return false;
  }
}
