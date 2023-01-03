import { Document, DocumentConstructorProps } from "../document";
import { TaxField, TextField, Amount, Locale, DateField } from "../../fields";

export class ReceiptV3 extends Document {
  /** Total amount with the tax amount of the purchase. */
  locale: Locale;
  /** Where the purchase was made, the language, and the currency. */
  totalIncl!: Amount;
  /** The purchase date. */
  date!: DateField;
  /** The type of purchase. */
  category!: TextField;
  /** Merchant's name as seen on the receipt. */
  merchantName!: TextField;
  /** Time as seen on the receipt in HH:MM format. */
  time!: TextField;
  /** Total tax amount of the purchase. */
  totalTax: Amount;
  /** Total amount without tax of the purchase. */
  totalExcl: Amount;
  /** List of different taxe. */
  taxes: TaxField[] = [];

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
      extras: extras,
      fullText: fullText,
    });
    this.locale = new Locale({
      prediction: prediction.locale,
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

    this.#initFromApiPrediction(prediction, pageId);
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
    this.category = new TextField({
      prediction: apiPrediction.category,
      pageId: pageId,
    });
    this.merchantName = new TextField({
      prediction: apiPrediction.supplier,
      pageId: pageId,
    });
    this.time = new TextField({
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
    return ReceiptV3.cleanOutString(outStr);
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
        value: this.totalIncl.value - TextField.arraySum(this.taxes),
        confidence:
          TextField.arrayConfidence(this.taxes) *
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
        confidence: TextField.arrayConfidence(this.taxes),
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
