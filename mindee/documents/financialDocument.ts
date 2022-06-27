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
  TypedField,
} from "./fields";

interface FinancialDocConstructorProps extends DocumentConstructorProps {
  documentType?: string;
}

export class FinancialDocument extends Document {
  /**
   *  @param {Object} apiPrediction - Json parsed prediction from HTTP response
   *  @param {Input} input - Input object
   *  @param {Integer} pageNumber - Page number for multi pages pdf input
   *  @param {Object} locale - locale value for creating FinancialDocument object from scratch
   *  @param {Object} totalIncl - total tax included value for creating FinancialDocument object from scratch
   *  @param {Object} totalExcl - total tax excluded value for creating FinancialDocument object from scratch
   *  @param {Object} Date - date value for creating FinancialDocument object from scratch
   *  @param {Object} InvoiceNumber - Invoice number value for creating FinancialDocument object from scratch
   *  @param {Object} taxes - taxes value for creating FinancialDocument object from scratch
   *  @param {Object} supplier - supplier value for creating FinancialDocument object from scratch
   *  @param {Object} supplierAddress - supplier address value for creating FinancialDocument object from scratch
   *  @param {Object} paymentDetails - payment details value for creating FinancialDocument object from scratch
   *  @param {Object} companyNumber - company number value for creating FinancialDocument object from scratch
   *  @param {Object} vatNumber - vat number value for creating FinancialDocument object from scratch
   *  @param {Object} orientation - orientation value for creating FinancialDocument object from scratch
   *  @param {Object} totalTax - total tax value for creating FinancialDocument object from scratch
   *  @param {Object} time - time value for creating FinancialDocument object from scratch
   *  @param {Object} customerName - customer name value for creating FinancialDocument object from scratch
   *  @param {Object} customerAddress - customer address value for creating FinancialDocument object from scratch
   *  @param {Object} customerCompanyRegistration - customer company registration value for creating FinancialDocument object from scratch
   *  @param {Object} pageNumber - pageNumber for multi pages pdf input
   *  @param {String} level - specify whether object is built from "page" level or "document" level prediction
   */
  pageNumber: number | undefined;
  locale!: Locale;
  totalIncl!: Amount;
  date!: Date;
  dueDate!: Date;
  category!: Field;
  merchantName: Field | undefined;
  time!: Field;
  orientation: Orientation | undefined;
  taxes: TaxField[];
  totalTax!: Amount;
  totalExcl!: Amount;
  words: any[] = [];
  supplier!: Field;
  supplierAddress!: Field;
  invoiceNumber!: Field;
  companyNumber: Field[] = [];
  customerName!: Field;
  customerAddress!: Field;
  paymentDetails: Field[] = [];
  customerCompanyRegistration: TypedField[] = [];

  constructor({
    apiPrediction,
    inputFile = undefined,
    fullText = undefined,
    pageNumber = undefined,
    documentType = "",
  }: FinancialDocConstructorProps) {
    super(documentType, inputFile, pageNumber, fullText);
    this.taxes = [];
    this.#initFromApiPrediction(apiPrediction, inputFile, pageNumber);
    this.#checklist();
  }

  #initFromApiPrediction(
    prediction: any,
    inputFile: any,
    pageNumber: number | undefined
  ) {
    if (Object.keys(prediction).includes("invoice_number")) {
      const invoice = new Invoice({
        apiPrediction: prediction,
        inputFile,
        pageNumber,
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
      this.companyNumber = invoice.companyNumber;
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
        pageNumber,
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
      if (receipt.words) this.words = receipt.words;
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
