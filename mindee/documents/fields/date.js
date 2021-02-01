const Field = require("./field");

class DateField extends Field {
  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageNumber - Page number for multi pages pdf
   */
  constructor({
    prediction,
    valueKey = "iso",
    reconstructed = false,
    pageNumber = 0,
  }) {
    super({ prediction, valueKey, reconstructed, pageNumber });
    this.dateObject = new Date(this.value);
    if (
      !(this.dateObject instanceof Date) ||
      isNaN(this.dateObject.valueOf())
    ) {
      this.dateObject = undefined;
      this.probability = 0.0;
      this.value = undefined;
    }
  }
}

module.exports = DateField;
