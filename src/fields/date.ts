import { Field, FieldConstructor } from "./field";

export class DateField extends Field {
  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageId - Page ID for multi-page document
   */
  public dateObject: Date | undefined;

  constructor({
    prediction,
    valueKey = "value",
    reconstructed = false,
    pageId,
  }: FieldConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });
    this.dateObject = new Date(this.value);
    if (isNaN(this.dateObject.valueOf())) {
      this.dateObject = undefined;
      this.confidence = 0.0;
      this.value = undefined;
    } else {
      this.dateObject.setUTCHours(0, 0, 0, 0);
    }
  }

  static compareDates(date1: Date, date2: Date): boolean {
    const check =
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
    return check;
  }
}