import { StringDict } from "../common";

/**
 * @property {object} prediction - Prediction object from HTTP response.
 * @property {string} valueKey - Key to use in the prediction dict.
 * @property {boolean} reconstructed - Is the object reconstructed (not extracted by the API).
 * @property {number} pageId - Page ID for multi-page document.
 */
export interface BaseFieldConstructor {
  prediction: StringDict;
  valueKey?: string;
  reconstructed?: boolean;
  pageId?: number;
}

/**
 * Base class for most fields.
 */
export class BaseField {
  /** The value. */
  value?: string | number | boolean = undefined;
  /** `true` when the field was reconstructed or computed using other fields. */
  reconstructed: boolean;
  /** Page ID for multi-page document. */
  pageId?: number;

  /**
   * @param {BaseFieldConstructor} constructor Constructor parameters.
   */
  constructor({
    prediction = {},
    valueKey = "value",
    reconstructed = false,
    pageId=undefined,
  }: BaseFieldConstructor) {
    this.reconstructed = reconstructed;
    if (
      prediction !== undefined &&
      prediction !== null &&
      valueKey in prediction &&
      prediction[valueKey] !== null
    ) {
      this.value = prediction[valueKey];
      this.pageId = pageId !== undefined ? pageId : prediction["page_id"];
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
   * @returns {number} Sum of all the Fields values in the array
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

  /**
   * Default string representation.
   */
  toString(): string {
    if (this.value !== undefined) {
      return `${this.value}`;
    }
    return "";
  }
}
