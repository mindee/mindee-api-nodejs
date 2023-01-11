export type StringDict = { [index: string]: any };

export interface BaseFieldConstructor {
  prediction: StringDict;
  valueKey?: string;
  reconstructed?: boolean;
}

export class BaseField {
  /** The value. */
  value?: string | number = undefined;
  /** `true` when the field was reconstructed or computed using other fields. */
  reconstructed: boolean;

  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   */
  constructor({
    prediction,
    valueKey = "value",
    reconstructed = false,
  }: BaseFieldConstructor) {
    this.reconstructed = reconstructed;
    if (
      prediction !== undefined &&
      prediction !== null &&
      valueKey in prediction &&
      prediction[valueKey] !== null
    ) {
      this.value = prediction[valueKey];
    }
  }

  compare(other: BaseField) {
    if (this.value === null && other.value === null) return true;
    if (this.value === null || other.value === null) return false;
    if (typeof this.value === "string" && typeof other.value === "string") {
      return this.value.toLowerCase() === other.value.toLowerCase();
    }
    return this.value === other.value;
  }

  /**
   * @param {BaseField[]} array - Array of Fields
   * @returns {Number} Sum of all the Fields values in the array
   */
  static arraySum(array: BaseField[]): number {
    let total = 0.0;
    for (const field of array) {
      if (typeof field.value !== "number") return 0.0;
      total += field.value;
      if (isNaN(total)) return 0.0;
    }
    return total;
  }

  toString(): string {
    if (this.value !== undefined) {
      return `${this.value}`;
    }
    return "";
  }
}