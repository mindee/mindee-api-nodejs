import { Field } from "./field";
import { floatToString } from "./amount";

interface TaxConstructor {
  prediction: any;
  valueKey?: string;
  rateKey?: string;
  codeKey?: string;
  reconstructed?: boolean;
  pageId?: number;
}

export class TaxField extends Field {
  /** The tax amount. */
  value?: number = undefined;
  /**  The tax code (HST, GST... for Canadian; City Tax, State tax for US, etc..). */
  rate?: number = undefined;
  /** The tax rate. */
  code?: string = undefined;
  /** The document page on which the information was found. */
  pageId!: number;

  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict to get the tax value
   * @param {String} rateKey - Key to use to get the tax rate in the prediction dict
   * @param {String} codeKey - Key to use to get the tax code in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageNumber - Page ID for multi-page document
   */
  constructor({
    prediction,
    valueKey = "value",
    rateKey = "rate",
    codeKey = "code",
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
  }

  toString(): string {
    let outStr = "";
    if (this.value !== undefined) {
      outStr += `${floatToString(this.value)}`;
    }
    if (this.rate !== undefined) {
      outStr += ` ${floatToString(this.rate)}%`;
    }
    if (this.code !== undefined) {
      outStr += ` ${this.code}`;
    }
    return outStr.trim();
  }
}
