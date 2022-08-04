import { Polygon, getBboxAsPolygon } from "../geometry";

export type stringDict = { [index: string]: any };

export interface FieldConstructor {
  prediction: { [index: string]: any };
  valueKey?: string;
  reconstructed?: boolean;
  pageId?: number | undefined;
}

interface BaseFieldConstructor {
  prediction: stringDict;
  valueKey: string;
}

export class BaseField {
  value?: any = undefined;

  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   */
  constructor({ prediction, valueKey }: BaseFieldConstructor) {
    if (valueKey in prediction && prediction[valueKey] !== null) {
      this.value = prediction[valueKey];
    }
  }
}

export class Field extends BaseField {
  bbox: Polygon = [];
  polygon: Polygon = [];
  pageId: number | undefined;
  confidence: number;
  reconstructed: boolean;
  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageId - Page ID for multi-page document
   * @param {Array<String>} extraFields - Extra fields to get from the prediction and to set as attribute of the Field
   */
  constructor({
    prediction,
    valueKey = "value",
    reconstructed = false,
    pageId,
  }: FieldConstructor) {
    super({ prediction, valueKey });
    this.pageId = pageId !== undefined ? pageId : prediction["page_id"];
    this.reconstructed = reconstructed;
    this.confidence = prediction.confidence ? prediction.confidence : 0.0;
    if (prediction.polygon) {
      this.polygon = prediction.polygon;
      this.bbox = getBboxAsPolygon(prediction.polygon);
    }
  }

  compare(other: Field) {
    if (this.value === null && other.value === null) return true;
    if (this.value === null || other.value === null) return false;
    if (typeof this.value === "string") {
      return this.value.toLowerCase() === other.value.toLowerCase();
    }
    return this.value === other.value;
  }

  /**
  @param {Array<Field>} array1 - first Array of Fields
  @param {Array<Field>} array2 - second Array of Fields
  @param {String} attr - Attribute to compare
  @returns {Boolean} - true if all elements in array1 exist in array2 and vice-versa, false otherwise
   */
  static compareArrays(
    array1: Field[],
    array2: Field[],
    attr = "value"
  ): boolean {
    const list1 = array1.map((item: any) => item[attr]);
    const list2 = array2.map((item: any) => item[attr]);
    if (list1.length !== list2.length) return false;
    for (const item1 of list1) {
      if (!list2.includes(item1)) return false;
    }
    return true;
  }

  /**
   * @param {Array<Field>} array - Array of Fields
   * @returns {Number} product of all the fields probaility
   */
  static arrayConfidence(array: any): number {
    let total = 1.0;
    for (const field of array) {
      total *= field.confidence;
      if (isNaN(total)) return 0.0;
    }
    return total;
  }

  /**
   * @param {Array<Field>} array - Array of Fields
   * @returns {Number} Sum of all the Fields values in the array
   */
  static arraySum(array: any): number {
    let total = 0.0;
    for (const field of array) {
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
