import { Document, DocumentConstructorProps } from "./document";
import { Invoice } from "./invoice";
import { Receipt } from "./receipt";
import {
  TaxField,
  Field,
  Amount,
  Locale,
  Orientation,
  DateField as Date,
  CompanyRegistration,
} from "../fields";
import {DOC_TYPE_INVOICE, DOC_TYPE_RECEIPT} from "./index";

interface FinancialDocConstructorProps extends DocumentConstructorProps {
  documentType?: string;
}

export class FinancialDocument extends Document {
  pageId: number | undefined;
  locale!: Locale;
  totalIncl!: Amount;
  date!: Date;
  dueDate!: Date;
  category!: Field;
  time!: Field;
  orientation: Orientation | undefined;
  taxes: TaxField[] = [];
  totalTax!: Amount;
  totalExcl!: Amount;
  supplier!: Field;
  supplierAddress!: Field;
  invoiceNumber!: Field;
  companyRegistration: CompanyRegistration[] = [];
  customerName!: Field;
  customerAddress!: Field;
  paymentDetails: Field[] = [];
  customerCompanyRegistration: CompanyRegistration[] = [];

  /**
   * @param {Object} apiPrediction - Json parsed prediction from HTTP response
   * @param {Input} inputFile - input file given to parse the document
   * @param {number} pageId - Page ID for multi-page document
   * @param {FullText} fullText - full OCR extracted text
   */
  constructor({
    apiPrediction,
    inputFile = undefined,
    fullText = undefined,
    pageId = undefined,
  }: DocumentConstructorProps) {
    let documentType: string;
    if (Object.keys(apiPrediction).includes("invoice_number")) {
      documentType = DOC_TYPE_INVOICE;
    } else {
      documentType = DOC_TYPE_RECEIPT;
    }
    super(documentType, inputFile, pageId, fullText);
    this.#initFromApiPrediction(apiPrediction, inputFile, pageId);
    this.#checklist();
  }

  #initFromApiPrediction(
    prediction: any,
    inputFile: any,
    pageNumber: number | undefined
  ) {
    if (this.internalDocType === DOC_TYPE_INVOICE) {
      const invoice = new Invoice({
        apiPrediction: prediction,
        inputFile,
        pageId: pageNumber,
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
      this.time = new Field({
        prediction: { value: undefined, confidence: 0.0 },
      });
      this.customerName = invoice.customerName;
      this.customerAddress = invoice.customerAddress;
      this.customerCompanyRegistration = invoice.customerCompanyRegistration;
    } else {
      const receipt = new Receipt({
        apiPrediction: prediction,
        inputFile,
        pageId: pageNumber,
      });
      this.orientation = receipt.orientation;
      this.date = receipt.date;
      this.dueDate = receipt.date;
      this.taxes = receipt.taxes;
      this.locale = receipt.locale;
      this.totalIncl = receipt.totalIncl;
      this.totalExcl = receipt.totalExcl;
      this.supplier = receipt.merchantName;
      this.supplierAddress = new Field({
        prediction: { value: undefined, confidence: 0.0 },
      });
      this.time = receipt.time;
      this.totalTax = receipt.totalTax;
      this.invoiceNumber = new Field({
        prediction: { value: undefined, confidence: 0.0 },
      });
      this.customerName = new Field({
        prediction: { value: undefined, confidence: 0.0 },
      });
      this.customerAddress = new Field({
        prediction: { value: undefined, confidence: 0.0 },
      });
    }
  }

  toString(): string {
    const outStr = `-----Financial document-----
Filename: ${this.filename}
Total amount: ${(this.totalIncl as Amount).value}
Date: ${(this.date as Date).value}
Supplier: ${(this.supplier as Field).value}
Total taxes: ${(this.totalTax as Amount).value}
----------------------
`;
    return FinancialDocument.cleanOutString(outStr);
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
