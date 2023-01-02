import { Field, FieldConstructor } from "./field";

export class DateField extends Field {
  /** Date string in ISO format. */
  value?: string;
  /** Date as a standard JavaScript `Date` object. */
  public dateObject?: Date;

  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageId - Page ID for multi-page document
   */
  constructor({
    prediction,
    valueKey = "value",
    reconstructed = false,
    pageId,
  }: FieldConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });
    if (typeof this.value === "string") {
      this.dateObject = new Date(this.value);
      if (isNaN(this.dateObject.valueOf())) {
        this.dateObject = undefined;
        this.confidence = 0.0;
        this.value = undefined;
      } else {
        this.dateObject.setUTCHours(0, 0, 0, 0);
      }
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
