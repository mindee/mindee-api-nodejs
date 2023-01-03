import { TaxField } from "../../fields";
import { floatToString } from "../../fields/amount";

interface ReceiptTaxConstructor {
  prediction: any;
  valueKey?: string;
  rateKey?: string;
  codeKey?: string;
  basisKey?: string;
  reconstructed?: boolean;
  pageId?: number;
}

export class ReceiptTaxField extends TaxField {
  /**  The tax base */
  basis?: number = undefined;

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
    basisKey = "base",
    reconstructed = false,
    pageId = undefined,
  }: ReceiptTaxConstructor) {
    super({ prediction, valueKey, rateKey, codeKey, reconstructed, pageId });

    this.basis = parseFloat(prediction[basisKey]);
    if (isNaN(this.basis)) this.basis = undefined;
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
    if (this.basis !== undefined) {
      outStr += ` ${this.basis}`;
    }
    return outStr.trim();
  }
}
