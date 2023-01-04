import { TaxField } from "../../fields";
import { floatToString } from "../../fields/amount";

interface ReceiptTaxConstructor {
  prediction: any;
  valueKey?: string;
  rateKey?: string;
  codeKey?: string;
  baseKey?: string;
  reconstructed?: boolean;
  pageId?: number;
}

export class ReceiptTaxField extends TaxField {
  /**  The tax base */
  base?: number = undefined;

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
    baseKey = "base",
    reconstructed = false,
    pageId = undefined,
  }: ReceiptTaxConstructor) {
    super({ prediction, valueKey, rateKey, codeKey, reconstructed, pageId });

    this.base = parseFloat(prediction[baseKey]);
    if (isNaN(this.base)) this.base = undefined;
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
    if (this.base !== undefined) {
      outStr += ` ${this.base}`;
    }
    return outStr.trim();
  }
}
