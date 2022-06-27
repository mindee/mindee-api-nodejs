import { Field } from "./field";
import { floatToString } from "./amount";

interface TaxConstructor {
  prediction: any;
  valueKey?: string;
  rateKey?: string;
  codeKey?: string;
  reconstructed?: boolean;
  pageNumber?: number;
}

export class TaxField extends Field {
  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict to get the tax value
   * @param {String} rateKey - Key to use to get the tax rate in the prediction dict
   * @param {String} codeKey - Key to use to get the tax code in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageNumber - Page number for multi-page PDF
   */
  value?: number = undefined;
  rate?: number = undefined;
  code?: string = undefined;

  constructor({
    prediction,
    valueKey = "value",
    rateKey = "rate",
    codeKey = "code",
    reconstructed = false,
    pageNumber = 0,
  }: TaxConstructor) {
    super({ prediction, valueKey, reconstructed, pageNumber });

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
