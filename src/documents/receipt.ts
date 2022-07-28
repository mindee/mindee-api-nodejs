import { Document, DocumentConstructorProps } from "./document";
import {
  TaxField,
  Field,
  Amount,
  Locale,
  Orientation,
  DateField,
} from "../fields";
import { DOC_TYPE_RECEIPT } from "./index";

export class Receipt extends Document {
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
  locale: Locale;
  totalIncl!: Amount;
  date!: DateField;
  category!: Field;
  merchantName!: Field;
  time!: Field;
  orientation: Orientation | undefined;
  totalTax: Amount;
  totalExcl: Amount;
  taxes: TaxField[] = [];

  constructor({
    apiPrediction,
    inputFile = undefined,
    fullText = undefined,
    pageId = undefined,
  }: DocumentConstructorProps) {
    super(DOC_TYPE_RECEIPT, inputFile, pageId, fullText);

    this.locale = new Locale({
      prediction: apiPrediction.locale,
      pageId: pageId,
    });
    this.totalTax = new Amount({
      prediction: { value: undefined, confidence: 0 },
      valueKey: "value",
      pageId: pageId,
    });
    this.totalExcl = new Amount({
      prediction: { value: undefined, confidence: 0 },
      valueKey: "value",
      pageId: pageId,
    });

    this.#initFromApiPrediction(apiPrediction, pageId);
    this.#checklist();
    this.#reconstruct();
  }

  #initFromApiPrediction(apiPrediction: any, pageId?: number) {
    this.totalIncl = new Amount({
      prediction: apiPrediction.total_incl,
      valueKey: "value",
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: apiPrediction.date,
      pageId: pageId,
    });
    this.category = new Field({
      prediction: apiPrediction.category,
      pageId: pageId,
    });
    this.merchantName = new Field({
      prediction: apiPrediction.supplier,
      pageId: pageId,
    });
    this.time = new Field({
      prediction: apiPrediction.time,
      pageId: pageId,
    });
    apiPrediction.taxes.map((taxPrediction: { [index: string]: any }) =>
      this.taxes.push(
        new TaxField({
          prediction: taxPrediction,
          pageId: pageId,
          valueKey: "value",
          rateKey: "rate",
          codeKey: "code",
        })
      )
    );
    if (pageId !== undefined) {
      this.orientation = new Orientation({
        prediction: apiPrediction.orientation,
        pageId,
      });
    }
  }

  toString(): string {
    const taxes = this.taxes.map((item) => item.toString()).join("\n       ");
    const outStr = `-----Receipt data-----
Filename: ${this.filename}
Total amount including taxes: ${this.totalIncl}
Total amount excluding taxes: ${this.totalExcl}
Date: ${this.date}
Category: ${this.category}
Time: ${this.time}
Merchant name: ${this.merchantName}
Taxes: ${taxes}
Total taxes: ${this.totalTax}
Locale: ${this.locale}
----------------------
`;
    return Receipt.cleanOutString(outStr);
  }

  /**
   * Call all check methods
   */
  #checklist() {
    this.checklist = { taxesMatchTotalIncl: this.#taxesMatchTotal() };
  }

  #taxesMatchTotal(): boolean {
    // Check taxes and total amount exist

    if (this.taxes.length === 0 || this.totalIncl.value === undefined) {
      return false;
    }

    // Reconstruct total_incl from taxes
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
    if (this.taxes.length && this.totalIncl.value !== undefined) {
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
  }

  /**
   * Set this.totalTax with Amount object
   * The totalTax Amount value is the sum of all this.taxes value
   * The totalTax Amount probability is the product of this.taxes probabilities
   */
  #reconstructTotalTax() {
    if (this.taxes.length && this.totalTax.value === undefined) {
      const totalTax = {
        value: this.taxes
          .map((tax) => tax.value || 0)
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
