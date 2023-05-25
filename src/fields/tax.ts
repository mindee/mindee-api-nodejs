import { StringDict } from "./base";
import { Field } from "./field";
import { floatToString } from "./amount";

interface TaxConstructor {
  prediction: StringDict;
  valueKey?: string;
  rateKey?: string;
  codeKey?: string;
  baseKey?: string;
  reconstructed?: boolean;
  pageId?: number;
}

export class TaxField extends Field {
  /** The tax amount. */
  value?: number = undefined;
  /** The tax rate. */
  rate?: number = undefined;
  /**  The tax code (HST, GST... for Canadian; City Tax, State tax for US, etc..). */
  code?: string = undefined;
  /**  The tax base */
  base?: number = undefined;
  /** The document page on which the information was found. */
  pageId!: number;

  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict to get the tax value
   * @param {String} rateKey - Key to use to get the tax rate in the prediction dict
   * @param {String} codeKey - Key to use to get the tax code in the prediction dict
   * @param {String} baseKey - Key to use to get the base tax in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageNumber - Page ID for multi-page document
   */
  constructor({
    prediction,
    valueKey = "value",
    rateKey = "rate",
    codeKey = "code",
    baseKey = "base",
    reconstructed = false,
    pageId = undefined,
  }: TaxConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });

    this.rate = +parseFloat(prediction[rateKey]);
    if (isNaN(this.rate)) this.rate = undefined;

    this.code = prediction[codeKey]?.toString();
    if (this.code === "N/A" || this.code === "None") {
      this.code = undefined;
    }

    this.value = parseFloat(prediction[valueKey]);
    if (isNaN(this.value)) {
      this.value = undefined;
      this.confidence = 0.0;
    }

    this.base = parseFloat(prediction[baseKey]);
    if (isNaN(this.base)) this.base = undefined;
  }

  #printableValues() {
    return {
      code: this.code ?? "",
      base: this.base !== undefined ? floatToString(this.base) : "",
      rate: this.rate !== undefined ? floatToString(this.rate) : "",
      value: this.value !== undefined ? floatToString(this.value) : "",
    };
  }

  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.base.padEnd(13) +
      " | " +
      printable.code.padEnd(6) +
      " | " +
      printable.rate.padEnd(8) +
      " | " +
      printable.value.padEnd(13) +
      " |"
    );
  }

  toString(): string {
    const printable = this.#printableValues();
    return (
      "Base: " +
      printable.base +
      ", Code: " +
      printable.code +
      ", Rate (%): " +
      printable.rate +
      ", Amount: " +
      printable.value
    ).trim();
  }
}

export class Taxes extends Array<TaxField> {
  init(prediction: StringDict[], pageId: number | undefined) {
    for (const entry of prediction) {
      this.push(
        new TaxField({
          prediction: entry,
          pageId: pageId,
        })
      );
    }
    return this;
  }

  #lineSeparator(char: string) {
    let outStr = "  ";
    outStr += `+${char.repeat(15)}`;
    outStr += `+${char.repeat(8)}`;
    outStr += `+${char.repeat(10)}`;
    outStr += `+${char.repeat(15)}`;
    return outStr + "+";
  }

  toString(): string {
    let outStr = `
${this.#lineSeparator("-")}
  | Base          | Code   | Rate (%) | Amount        |
${this.#lineSeparator("=")}`;
    for (const entry of this.entries()) {
      outStr += `\n  ${entry[1].toTableLine()}\n${this.#lineSeparator("-")}`;
    }
    return outStr;
  }
}
