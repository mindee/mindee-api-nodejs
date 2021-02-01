const Field = require("./field");

class Amount extends Field {
  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageNumber - Page number for multi pages pdf
   */
  constructor({
    prediction,
    valueKey = "amount",
    reconstructed = false,
    pageNumber = 0,
  }) {
    super({ prediction, valueKey, reconstructed, pageNumber });
    this.value = +parseFloat(prediction[valueKey]).toFixed(3);
    if (isNaN(this.value)) {
      this.value = undefined;
      this.probability = 0;
    }
  }
}

module.exports = Amount;
