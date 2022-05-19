import { Document } from "./document";
import {
  TaxField,
  Field,
  Amount,
  Locale,
  Orientation,
  DateField,
} from "./fields";
import { promises as fs } from "fs";

interface ReceiptInterface {
  pageNumber: number | undefined;
  level: string;
  locale: Locale | undefined;
  totalIncl: Amount | undefined;
  date: DateField | undefined;
  category: Field | undefined;
  merchantName: Field | undefined;
  time: Field | undefined;
  orientation: Orientation | undefined;
  taxes: TaxField[];
  totalTax: Amount | undefined;
  totalExcl: Amount | undefined;
  words: any[] | undefined;
}

export class Receipt extends Document implements ReceiptInterface {
  /**
   *  @param {Object} apiPrediction - Json parsed prediction from HTTP response
   *  @param {Input} input - Input object
   *  @param {Integer} pageNumber - Page number for multi pages pdf input
   *  @param {Object} locale - locale value for creating Receipt object from scratch
   *  @param {Object} totalIncl - total tax Included value for creating Receipt object from scratch
   *  @param {Object} date - date value for creating Receipt object from scratch
   *  @param {Object} category - category value for creating Receipt object from scratch
   *  @param {Object} merchantName - merchant name value for creating Receipt object from scratch
   *  @param {Object} time - time value for creating Receipt object from scratch
   *  @param {Object} taxes - taxes value for creating Receipt object from scratch
   *  @param {Object} orientation - orientation value for creating Receipt object from scratch
   *  @param {Object} totalTax - total taxes value for creating Receipt object from scratch
   *  @param {Object} totalExcl - total taxes excluded value for creating Receipt object from scratch
   *  @param {String} level - specify whether object is built from "page" level or "document" level prediction
   */
  pageNumber: number | undefined;
  level: string;
  locale: Locale | undefined;
  totalIncl: Amount | undefined;
  date: DateField | undefined;
  category: Field | undefined;
  merchantName: Field | undefined;
  time: Field | undefined;
  orientation: Orientation | undefined;
  taxes: TaxField[];
  totalTax: Amount | undefined;
  totalExcl: Amount | undefined;
  words: any[] | undefined;

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
    this.constructPrediction = function (item: any) {
      return { prediction: { value: item }, valueKey: "value", pageNumber };
    };
    this.#initFromApiPrediction(apiPrediction, pageNumber, words);
    this.#checklist();
    this.#reconstruct();
  }

  /**
   Set the object attributes with api prediction values
   @param prediction: Raw prediction from HTTP response
   @param pageNumber: Page number for multi pages pdf input
   */
  #initFromApiPrediction(prediction: any, pageNumber: number, words: any) {
    this.locale = new Locale({ prediction: prediction.locale, pageNumber });
    this.totalIncl = new Amount({
      prediction: prediction.total_incl,
      valueKey: "value",
      pageNumber,
    });
    this.date = new DateField({
      prediction: prediction.date,
      valueKey: "value",
      pageNumber,
    });
    this.category = new Field({
      prediction: prediction.category,
      pageNumber,
    });
    this.merchantName = new Field({
      prediction: prediction.supplier,
      valueKey: "value",
      pageNumber,
    });
    this.time = new Field({
      prediction: prediction.time,
      valueKey: "value",
      pageNumber,
    });
    this.taxes = prediction.taxes.map(
      (taxPrediction: any) =>
        new TaxField({
          prediction: taxPrediction,
          pageNumber,
          valueKey: "value",
          rateKey: "rate",
          codeKey: "code",
        })
    );
    this.totalTax = new Amount({
      prediction: { value: undefined, confidence: 0 },
      valueKey: "value",
      pageNumber,
    });
    this.totalExcl = new Amount({
      prediction: { value: undefined, confidence: 0 },
      valueKey: "value",
      pageNumber,
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
    const taxes = this.taxes.map((tax: any) => tax.toString()).join(" - ");
    return `
    -----Receipt data-----
    Filename: ${this.filename}
    Total amount: ${(this.totalIncl as Amount).value}
    Date: ${this.date?.value}
    Category: ${(this.category as Field).value}
    Time: ${(this.time as Field).value}
    Merchant name: ${(this.merchantName as Field).value}
    Taxes: ${taxes}
    Total taxes: ${(this.totalTax as Amount).value}
    `;
  }

  static async load(path: any) {
    const file = fs.readFile(path);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const args = JSON.parse(file);
    return new Receipt({ reconstructed: true, ...args });
  }

  /**
   * Call all check methods
   */
  #checklist() {
    this.checklist = { taxesMatchTotalIncl: this.#taxesMatchTotal() };
  }

  #taxesMatchTotal() {
    // Check taxes and total amount exist

    if (
      (this.taxes as any[]).length === 0 ||
      (this.totalIncl as Amount).value === null
    )
      return false;

    // Reconstruct total_incl from taxes
    let totalVat = 0;
    let reconstructedTotal = 0;
    (this.taxes as any[]).forEach((tax: any) => {
      if (tax.value === null || !tax.rate) return false;
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
      this.taxes = (this.taxes as any[]).map((tax: any) => ({
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
   * Call all fields that need to be reconstructed
   */
  #reconstruct() {
    this.#reconstructTotalExclFromTCCAndTaxes();
    this.#reconstructTotalTax();
  }

  /**
   * Set this.totalExcl with Amount object
   * The totalExcl Amount value is the difference between totalIncl and sum of taxes
   * The totalExcl Amount probability is the product of this.taxes probabilities multiplied by totalIncl probability
   */
  #reconstructTotalExclFromTCCAndTaxes() {
    if (this.taxes.length && (this.totalIncl as Amount).value !== undefined) {
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

  /**
   * Set this.totalTax with Amount object
   * The totalTax Amount value is the sum of all this.taxes value
   * The totalTax Amount probability is the product of this.taxes probabilities
   */
  #reconstructTotalTax() {
    if (this.taxes.length && (this.totalTax as Amount).value === undefined) {
      const totalTax = {
        value: (this.taxes as any[])
          .map((tax: any) => tax.value || 0)
          .reduce((a: any, b: any) => a + b, 0),
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
}
