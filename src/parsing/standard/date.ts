import { Field } from "./field";
import { BaseFieldConstructor } from "./base";

/**
 * A field containing a date value.
 */
export class DateField extends Field {
  /** Date string in ISO format. */
  value?: string;
  /** Date as a standard JavaScript `Date` object. */
  public dateObject?: Date;
  /** Whether the field was computed or retrieved directly from the document. */
  public isComputed?: boolean;

  /**
   * @param {BaseFieldConstructor} constructor Constructor parameters.
   */
  constructor({
    prediction = {},
    valueKey = "value",
    reconstructed = false,
    pageId,
  }: BaseFieldConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });
    if ("is_computed" in prediction)
    {
      this.isComputed = prediction["is_computed"];
    }
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
