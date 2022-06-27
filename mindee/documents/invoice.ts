import { Document, DocumentConstructorProps } from "./document";

import {
  TaxField,
  PaymentDetails,
  Orientation,
  Locale,
  Amount,
  Field,
  DateField as Date,
  TypedField,
} from "./fields";

interface InvoiceConstructorProps extends DocumentConstructorProps {
  documentType?: string;
}

export class Invoice extends Document {
  /**
   *  @param {Object} apiPrediction - Json parsed prediction from HTTP response
   *  @param {Input} input - Input object
   *  @param {Object} locale - locale value for creating Invoice object from scratch
   *  @param {Object} totalIncl - total tax included value for creating Invoice object from scratch
   *  @param {Object} totalExcl - total tax excluded value for creating Invoice object from scratch
   *  @param {Object} invoiceDate - invoice date value for creating Invoice object from scratch
   *  @param {Object} invoiceNumber - invoice number value for creating Invoice object from scratch
   *  @param {Object} taxes - taxes value for creating Invoice object from scratch
   *  @param {Object} supplier - supplier value for creating Invoice object from scratch
   *  @param {Object} supplierAddress - supplier address value for creating Invoice object from scratch
   *  @param {Object} paymentDetails - payment details value for creating Invoice object from scratch
   *  @param {Object} companyNumber - company number value for creating Invoice object from scratch
   *  @param {Object} vatNumber - vat number value for creating Invoice object from scratch
   *  @param {Object} orientation - orientation value for creating Invoice object from scratch
   *  @param {Object} totalTax - total tax value for creating Invoice object from scratch
   *  @param {Object} customerName - customer name value for creating Invoice object from scratch
   *  @param {Object} customerAddress - customer address value for creating Invoice object from scratch
   *  @param {Object} customerCompanyRegistration - customer company registration value for creating Invoice object from scratch
   *  @param {Number} pageNumber - pageNumber for multi pages pdf input
   */
  locale!: Locale;
  totalIncl!: Amount;
  date!: Date;
  dueDate!: Date;
  category!: Field;
  time!: Field;
  orientation!: Orientation;
  totalTax!: Amount;
  totalExcl!: Amount;
  supplier!: Field;
  supplierAddress!: Field;
  invoiceNumber!: Field;
  companyNumber: Field[] = [];
  customerName!: Field;
  customerAddress!: Field;
  taxes: TaxField[] = [];
  paymentDetails: PaymentDetails[] = [];
  customerCompanyRegistration: TypedField[] = [];

  constructor({
    apiPrediction,
    inputFile = undefined,
    fullText = undefined,
    pageNumber = undefined,
    documentType = "",
  }: InvoiceConstructorProps) {
    super(documentType, inputFile, pageNumber, fullText);
    this.#initFromApiPrediction(apiPrediction, pageNumber);
    this.#checklist();
    this.#reconstruct();
  }

  #initFromApiPrediction(apiPrediction: any, pageNumber?: number) {
    this.locale = new Locale({
      prediction: apiPrediction.locale,
      pageNumber: pageNumber,
      valueKey: "language",
    });
    this.totalIncl = new Amount({
      prediction: apiPrediction.total_incl,
      valueKey: "value",
      pageNumber,
    });
    this.totalTax = new Amount({
      prediction: { value: undefined, confidence: 0.0 },
      valueKey: "value",
      pageNumber,
    });
    this.totalExcl = new Amount({
      prediction: apiPrediction.total_excl,
      valueKey: "value",
      pageNumber,
    });
    this.date = new Date({
      prediction: apiPrediction.date,
      valueKey: "value",
      pageNumber,
    });
    apiPrediction.taxes.map((prediction: { [index: string]: any }) =>
      this.taxes.push(
        new TaxField({
          prediction: prediction,
          pageNumber,
          valueKey: "value",
          rateKey: "rate",
          codeKey: "code",
        })
      )
    );
    this.companyNumber = apiPrediction.company_registration.map(
      function (prediction: { [index: string]: any }) {
        return new TypedField({
          prediction: prediction,
          pageNumber,
        });
      }
    );
    this.dueDate = new Date({
      prediction: apiPrediction.due_date,
      valueKey: "value",
      pageNumber,
    });
    this.invoiceNumber = new Field({
      prediction: apiPrediction.invoice_number,
      pageNumber,
    });
    this.supplier = new Field({
      prediction: apiPrediction.supplier,
      pageNumber,
    });
    this.supplierAddress = new Field({
      prediction: apiPrediction.supplier_address,
      pageNumber,
    });
    this.customerName = new Field({
      prediction: apiPrediction.customer,
      pageNumber,
    });
    this.customerAddress = new Field({
      prediction: apiPrediction.customer_address,
      pageNumber,
    });
    apiPrediction.customer_company_registration.map(
      (prediction: { [index: string]: any }) =>
        this.customerCompanyRegistration.push(
          new TypedField({
            prediction: prediction,
            pageNumber,
          })
        )
    );
    apiPrediction.payment_details.map((prediction: { [index: string]: any }) =>
      this.paymentDetails.push(
        new PaymentDetails({
          prediction: prediction,
          pageNumber,
        })
      )
    );
    if (pageNumber !== undefined) {
      this.orientation = new Orientation({
        prediction: apiPrediction.orientation,
        pageNumber,
      });
    }
  }

  toString(): string {
    const taxes = this.taxes.map((item) => item.toString()).join("\n       ");
    const paymentDetails = this.paymentDetails
      .map((item) => item.toString())
      .join("\n                 ");
    const companyRegistration = this.customerCompanyRegistration
      .map((item) => item.toString())
      .join("; ");
    const companyNumbers = this.companyNumber
      .map((item) => item.toString())
      .join("; ");

    const outStr = `-----Invoice data-----
Filename: ${this.filename}
Invoice number: ${this.invoiceNumber}
Total amount including taxes: ${this.totalIncl}
Total amount excluding taxes: ${this.totalExcl}
Invoice date: ${this.date}
Invoice due date: ${this.dueDate}
Supplier name: ${this.supplier}
Supplier address: ${this.supplierAddress}
Customer name: ${this.customerName}
Customer company registration: ${companyRegistration}
Customer address: ${this.customerAddress}
Payment details: ${paymentDetails}
Company numbers: ${companyNumbers}
Taxes: ${taxes}
Total taxes: ${this.totalTax}
Locale: ${this.locale}
----------------------
`;
    return Invoice.cleanOutString(outStr);
  }

  #checklist() {
    this.checklist = {
      taxesMatchTotalIncl: this.taxesMatchTotalIncl(),
      taxesMatchTotalExcl: this.taxesMatchTotalExcl(),
      taxesAndTotalExclMatchTotalIncl: this.taxesAndTotalExclMatchTotalIncl(),
    };
  }

  #reconstruct() {
    this.#reconstructTotalTax();
    this.#reconstructTotalExcl();
    this.#reconstructTotalIncl();
    this.#reconstructTotalTaxFromTotals();
  }

  private taxesMatchTotalIncl(): boolean {
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
      this.taxes.forEach((tax) => {
        tax.confidence = 1.0;
      });
      this.totalTax.confidence = 1.0;
      this.totalIncl.confidence = 1.0;
      return true;
    }
    return false;
  }

  /**
   *
   */
  private taxesMatchTotalExcl(): boolean {
    // Check taxes and total amount exist
    if (this.taxes.length === 0 || this.totalExcl.value === undefined) {
      return false;
    }

    // Reconstruct total_incl from taxes
    let totalVat = 0;
    let reconstructedTotal = 0;
    this.taxes.forEach((tax) => {
      if (tax.value === undefined || !tax.rate) {
        return false;
      }
      totalVat += tax.value;
      reconstructedTotal += (100 * tax.value) / tax.rate;
    });

    // Sanity check
    if (totalVat <= 0) return false;

    // Crate epsilon
    const eps = 1 / (100 * totalVat);

    if (
      this.totalExcl.value * (1 - eps) - 0.02 <= reconstructedTotal &&
      reconstructedTotal <= this.totalExcl.value * (1 + eps) + 0.02
    ) {
      this.taxes.forEach((tax) => {
        tax.confidence = 1.0;
      });
      this.totalTax.confidence = 1.0;
      this.totalExcl.confidence = 1.0;
      return true;
    }
    return false;
  }

  private taxesAndTotalExclMatchTotalIncl(): boolean {
    if (
      this.totalExcl.value === undefined ||
      this.taxes.length === 0 ||
      this.totalIncl.value === undefined
    )
      return false;
    let totalVat = 0;
    this.taxes.forEach((tax) => (totalVat += tax.value || 0));
    const reconstructedTotal = totalVat + this.totalExcl.value;

    if (totalVat <= 0) return false;

    if (
      this.totalIncl.value - 0.01 <= reconstructedTotal &&
      reconstructedTotal <= this.totalIncl.value + 0.01
    ) {
      this.taxes.forEach((tax) => {
        tax.confidence = 1.0;
      });
      this.totalTax.confidence = 1.0;
      this.totalIncl.confidence = 1.0;
      return true;
    }
    return false;
  }

  #reconstructTotalTax() {
    if (this.taxes.length > 0) {
      const totalTax = {
        value: this.taxes.reduce((acc, tax) => {
          return tax.value !== undefined ? acc + tax.value : acc;
        }, 0),
        confidence: Field.arrayConfidence(this.taxes),
      };
      if (totalTax.value > 0)
        this.totalTax = new Amount({
          prediction: totalTax,
          valueKey: "value",
          reconstructed: true,
        });
    }
  }

  #reconstructTotalTaxFromTotals() {
    if (
      this.totalTax.value !== undefined ||
      this.totalExcl.value === undefined ||
      this.totalIncl.value === undefined
    ) {
      return;
    }
    const totalTax = {
      value: this.totalIncl.value - this.totalExcl.value,
      confidence: this.totalIncl.confidence * this.totalExcl.confidence,
    };
    if (totalTax.value >= 0) {
      this.totalTax = new Amount({
        prediction: totalTax,
        valueKey: "value",
        reconstructed: true,
      });
    }
  }

  #reconstructTotalExcl() {
    if (
      this.totalIncl.value === undefined ||
      this.taxes.length === 0 ||
      this.totalExcl.value !== undefined
    ) {
      return;
    }
    const totalExcl = {
      value: this.totalIncl.value - Field.arraySum(this.taxes),
      confidence:
        Field.arrayConfidence(this.taxes) *
        (this.totalIncl as Amount).confidence,
    };
    this.totalExcl = new Amount({
      prediction: totalExcl,
      valueKey: "value",
      reconstructed: true,
    });
  }

  #reconstructTotalIncl() {
    if (
      !(
        this.totalExcl.value === undefined ||
        this.taxes.length === 0 ||
        this.totalIncl.value !== undefined
      )
    ) {
      const totalIncl = {
        value:
          this.totalExcl.value +
          (this.taxes as any[]).reduce((acc, tax) => {
            return tax.value ? acc + tax.value : acc;
          }, 0.0),
        confidence:
          Field.arrayConfidence(this.taxes) * this.totalExcl.confidence,
      };
      this.totalIncl = new Amount({
        prediction: totalIncl,
        valueKey: "value",
        reconstructed: true,
      });
    }
  }
}
