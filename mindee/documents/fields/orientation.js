const Field = require("./field");

class Orientation extends Field {
  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageNumber - Page number for multi pages pdf
   */
  constructor({
    prediction,
    valueKey = "degrees",
    reconstructed = false,
    pageNumber = 0,
  }) {
    const orientations = [0, 90, 180, 270];
    super({ prediction, valueKey, reconstructed, pageNumber });
    this.value = parseInt(prediction[valueKey]);
    if (isNaN(this.value)) this.probability = 0.0;
    if (!orientations.includes(this.value)) this.value = 0;
  }
}

module.exports = Orientation;
