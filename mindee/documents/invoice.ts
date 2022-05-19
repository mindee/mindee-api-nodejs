import { Document } from "./document";

import {
  TaxField,
  PaymentDetails,
  Orientation,
  Locale,
  Amount,
  Field,
  DateField as Date,
} from "./fields";

interface InvoiceInterface {
  pageNumber: number | undefined;
  level: string;
  locale: Locale | undefined;
  totalIncl: Amount | undefined;
  date: Date | undefined;
  invoiceDate: Date | undefined;
  dueDate: Date | undefined;
  category: Field | undefined;
  merchantName: Field | undefined;
  time: Field | undefined;
  orientation: Orientation | undefined;
  taxes: TaxField[];
  totalTax: Amount | undefined;
  totalExcl: Amount | undefined;
  words: any[] | undefined;
  supplier: Field | undefined;
  supplierAddress: Field | undefined;
  invoiceNumber: Field | undefined;
  paymentDetails: Field | undefined;
  companyNumber: Field | undefined;
  vatNumber: Field | undefined;
  customerName: Field | undefined;
  customerAddress: Field | undefined;
  customerCompanyRegistration: Field | undefined;
}

export class Invoice extends Document implements InvoiceInterface {
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
   *  @param {String} level - specify whether object is built from "page" level or "document" level prediction
   */
  pageNumber: number | undefined;
  level: string;
  locale: Locale | undefined;
  totalIncl: Amount | undefined;
  date: Date | undefined;
  invoiceDate: Date | undefined;
  dueDate: Date | undefined;
  category: Field | undefined;
  merchantName: Field | undefined;
  time: Field | undefined;
  orientation: Orientation | undefined;
  taxes: TaxField[];
  totalTax: Amount | undefined;
  totalExcl: Amount | undefined;
  words: any[] | undefined;
  supplier: Field | undefined;
  supplierAddress: Field | undefined;
  invoiceNumber: Field | undefined;
  paymentDetails: Field | undefined;
  companyNumber: Field | undefined;
  vatNumber: Field | undefined;
  customerName: Field | undefined;
  customerAddress: Field | undefined;
  customerCompanyRegistration: Field | undefined;

  private readonly constructPrediction: (item: any) => {
    pageNumber: number;
    prediction: { value: any };
    valueKey: string;
  };

  constructor({
    apiPrediction = undefined,
    inputFile = undefined,
    words = undefined,
    pageNumber = 0,
    level = "page",
    documentType = "",
  }) {
    super(documentType, inputFile);
    this.level = level;
    this.taxes = [];
    this.constructPrediction = function (item) {
      return { prediction: { value: item }, valueKey: "value", pageNumber };
    };
    this.#initFromApiPrediction(apiPrediction, pageNumber, words);
    this.#checklist();
    this.#reconstruct();
  }

  #initFromApiPrediction(prediction: any, pageNumber: number, words: any) {
    this.locale = new Locale({ prediction: prediction.locale, pageNumber });
    this.totalIncl = new Amount({
      prediction: prediction.total_incl,
      valueKey: "value",
      pageNumber,
    });
    this.totalTax = new Amount({
      prediction: { value: undefined, confidence: 0.0 },
      valueKey: "value",
      pageNumber,
    });
    this.totalExcl = new Amount({
      prediction: prediction.total_excl,
      valueKey: "value",
      pageNumber,
    });
    this.date = new Date({
      prediction: prediction.date,
      valueKey: "value",
      pageNumber,
    });
    this.invoiceDate = new Date({
      prediction: prediction.date,
      valueKey: "value",
      pageNumber,
    });
    this.taxes = prediction.taxes.map(function (taxPrediction: any) {
      return new TaxField({
        prediction: taxPrediction,
        pageNumber,
        valueKey: "value",
        rateKey: "rate",
        codeKey: "code",
      });
    });
    this.companyNumber = prediction.company_registration.map(function (
      companyNumber: any
    ) {
      return new Field({
        prediction: companyNumber,
        pageNumber,
        extraFields: ["type"],
      });
    });
    this.dueDate = new Date({
      prediction: prediction.due_date,
      valueKey: "value",
      pageNumber,
    });
    this.invoiceNumber = new Field({
      prediction: prediction.invoice_number,
      pageNumber,
    });
    this.supplier = new Field({
      prediction: prediction.supplier,
      pageNumber,
    });
    this.supplierAddress = new Field({
      prediction: prediction.supplier_address,
      pageNumber,
    });
    this.customerName = new Field({
      prediction: prediction.customer,
      pageNumber,
    });
    this.customerAddress = new Field({
      prediction: prediction.customer_address,
      pageNumber,
    });
    this.customerCompanyRegistration =
      prediction.customer_company_registration.map(function (
        customerCompanyRegistration: any
      ) {
        return new Field({
          prediction: customerCompanyRegistration,
          pageNumber,
          extraFields: ["type"],
        });
      });
    this.paymentDetails = prediction.payment_details.map(function (
      paymentDetail: any
    ) {
      return new PaymentDetails({ prediction: paymentDetail, pageNumber });
    });
    if (this.level === "page") {
      this.orientation = new Orientation({
        prediction: prediction.orientation,
        pageNumber,
      });
    } else {
      this.orientation = new Orientation(
        this.constructPrediction({
          prediction: {
            value: undefined,
            confidence: 0.0,
            degrees: undefined,
          },
        })
      );
    }
    if (words && words.length > 0) this.words = words;
  }

  toString() {
    const taxes = this.taxes.map((tax) => tax.toString()).join(" - ");
    return `
    -----Invoice data-----
    Filename: ${this.filename}
    Invoice number: ${(this.invoiceNumber as Field).value}
    Total amount including taxes: ${(this.totalIncl as Amount).value}
    Total amount excluding taxes: ${(this.totalExcl as Amount).value}
    Invoice Date: ${(this.invoiceDate as Date).value}
    Supplier name: ${(this.supplier as Field).value}
    Supplier address: ${(this.supplierAddress as Field).value}
    Customer name: ${(this.customerName as Field).value}
    Customer address: ${(this.customerAddress as Field).value}
    Taxes: ${taxes}
    Total taxes: ${(this.totalTax as Amount).value}
    `;
  }

  #checklist() {
    this.checklist = {
      taxesMatchTotalIncl: this.#taxesMatchTotalIncl(),
      taxesMatchTotalExcl: this.#taxesMatchTotalExcl(),
      taxesAndTotalExclMatchTotalIncl: this.#taxesAndTotalExclMatchTotalIncl(),
    };
  }

  #reconstruct() {
    this.#reconstructTotalTax();
    this.#reconstructTotalExcl();
    this.#reconstructTotalIncl();
    this.#reconstructTotalTaxFromTotals();
  }

  #taxesMatchTotalIncl() {
    // Check taxes and total include exist
    if (
      (this.taxes as any[]).length === 0 ||
      (this.totalIncl as Amount).value === undefined
    )
      return false;

    // Reconstruct totalIncl from taxes
    let totalVat = 0;
    let reconstructedTotal = 0;
    (this.taxes as any[]).forEach((tax) => {
      if (tax.value === undefined || !tax.rate) return false;
      totalVat += tax.value;
      reconstructedTotal += tax.value + (100 * tax.value) / tax.rate;
    });

    // Sanity check
    if (totalVat <= 0) return false;

    // Crate epsilon
    const eps = 1 / (100 * totalVat);

    if (
      (this.totalIncl as Amount).value * (1 - eps) - 0.02 <=
        reconstructedTotal &&
      reconstructedTotal <= (this.totalIncl as Amount).value * (1 + eps) + 0.02
    ) {
      this.taxes = (this.taxes as any[]).map((tax) => ({
        ...tax,
        confidence: 1.0,
      }));
      (this.totalTax as Amount).confidence = 1.0;
      (this.totalIncl as Amount).confidence = 1.0;
      return true;
    }
    return false;
  }

  /**
   *
   */
  #taxesMatchTotalExcl() {
    // Check taxes and total amount exist
    if (
      (this.taxes as any[]).length === 0 ||
      (this.totalExcl as Amount).value === null
    )
      return false;

    // Reconstruct total_incl from taxes
    let totalVat = 0;
    let reconstructedTotal = 0;
    (this.taxes as any[]).forEach((tax) => {
      if (tax.value === null || !tax.rate) return false;
      totalVat += tax.value;
      reconstructedTotal += (100 * tax.value) / tax.rate;
    });

    // Sanity check
    if (totalVat <= 0) return false;

    // Crate epsilon
    const eps = 1 / (100 * totalVat);

    if (
      (this.totalExcl as Amount).value * (1 - eps) - 0.02 <=
        reconstructedTotal &&
      reconstructedTotal <= (this.totalExcl as Amount).value * (1 + eps) + 0.02
    ) {
      this.taxes = (this.taxes as any[]).map((tax) => ({
        ...tax,
        confidence: 1.0,
      }));
      (this.totalTax as Amount).confidence = 1.0;
      (this.totalExcl as Amount).confidence = 1.0;
      return true;
    }
    return false;
  }

  #taxesAndTotalExclMatchTotalIncl() {
    if (
      (this.totalExcl as Amount).value === undefined ||
      (this.taxes as any[]).length === 0 ||
      (this.totalIncl as Amount) === undefined
    )
      return false;
    let totalVat = 0;
    (this.taxes as any[]).forEach((tax) => (totalVat += tax.value));
    const reconstructedTotal = totalVat + (this.totalExcl as Amount).value;

    if (totalVat <= 0) return false;

    if (
      (this.totalIncl as Amount).value - 0.01 <= reconstructedTotal &&
      reconstructedTotal <= (this.totalIncl as Amount).value + 0.01
    ) {
      this.taxes = (this.taxes as any[]).map((tax) => ({
        ...tax,
        confidence: 1.0,
      }));
      (this.totalTax as Amount).confidence = 1.0;
      (this.totalIncl as Amount).confidence = 1.0;
      return true;
    }
    return false;
  }

  #reconstructTotalTax() {
    if ((this.taxes as any[]).length > 0) {
      const totalTax = {
        value: (this.taxes as any[]).reduce((acc, tax) => {
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
      (this.totalTax as Amount).value === undefined &&
      (this.totalIncl as Amount).value > 0 &&
      (this.totalExcl as Amount).value > 0 &&
      (this.totalExcl as Amount).value <= (this.totalIncl as Amount).value
    ) {
      const totalTax = {
        value:
          (this.totalIncl as Amount).value - (this.totalExcl as Amount).value,
        confidence:
          (this.totalIncl as Amount).confidence *
          (this.totalExcl as Amount).confidence,
      };
      if (totalTax.value > 0)
        this.totalTax = new Amount({
          prediction: totalTax,
          valueKey: "value",
          reconstructed: true,
        });
    }
  }

  #reconstructTotalExcl() {
    if (
      this.taxes.length &&
      (this.totalIncl as Amount).value !== null &&
      (this.totalExcl as Amount).value === undefined
    ) {
      const totalExcl = {
        value: (this.totalIncl as Amount).value - Field.arraySum(this.taxes),
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
  }

  #reconstructTotalIncl() {
    if (
      this.taxes.length &&
      (this.totalExcl as Amount).value !== null &&
      (this.totalIncl as Amount).value === undefined
    ) {
      const totalIncl = {
        value:
          (this.totalExcl as Amount).value +
          (this.taxes as any[]).reduce((acc, tax) => {
            return tax.value ? acc + tax.value : acc;
          }, 0.0),
        confidence:
          Field.arrayConfidence(this.taxes) *
          (this.totalExcl as Amount).confidence,
      };
      this.totalIncl = new Amount({
        prediction: totalIncl,
        valueKey: "value",
        reconstructed: true,
      });
    }
  }
}
