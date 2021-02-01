const Field = require("./field");

class Tax extends Field {
  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict to get the tax value
   * @param {String} rateKey - Key to use to get the tax rate in the prediction dict
   * @param {String} codeKey - Key to use to get the tax code in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageNumber - Page number for multi pages pdf
   */
  constructor({
    prediction,
    valueKey = "value",
    rateKey = "rate",
    codeKey = "code",
    reconstructed = false,
    pageNumber = 0,
  }) {
    super({ prediction, valueKey, reconstructed, pageNumber });

    this.rate = parseFloat(prediction[rateKey]);
    if (isNaN(this.rate)) this.rate = undefined;

    this.code = prediction[codeKey]?.toString();
    if (this.code === "N/A") this.code = undefined;

    this.value = parseFloat(prediction[valueKey]);
    if (isNaN(this.value)) {
      this.value = undefined;
      this.probability = 0.0;
    }
  }

  toString() {
    let str = "";
    const keys = ["value", "rate", "code"];
    for (const [i, key] of keys.entries()) {
      const value = this[key] === undefined ? "_" : this[key].toString();
      if (i < keys.length - 1) str += `${value}${key === "rate" ? "%" : ""}; `;
      else str += value;
    }
    return str;
  }
}

module.exports = Tax;
