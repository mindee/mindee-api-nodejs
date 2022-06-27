import * as geometry from "../../geometry";

export interface FieldConstructor {
  prediction: { [index: string]: any };
  valueKey?: string;
  reconstructed?: boolean;
  pageNumber?: number | undefined;
}

export class Field {
  bbox: geometry.Polygon = [];
  polygon: geometry.Polygon = [];
  pageNumber: number | undefined;
  confidence: number;
  reconstructed: boolean;
  value?: any;
  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageNumber - Page number for multi-page PDF
   * @param {Array<String>} extraFields - Extra fields to get from the prediction and to set as attribute of the Field
   */
  constructor({
    prediction,
    valueKey = "value",
    reconstructed = false,
    pageNumber,
  }: FieldConstructor) {
    this.pageNumber = pageNumber;
    this.reconstructed = reconstructed;
    this.value = undefined;
    this.confidence = prediction.confidence ? prediction.confidence : 0.0;
    // TODO: make a real BBOX
    if (prediction.polygon) {
      this.polygon = prediction.polygon;
      this.bbox = geometry.getBboxAsPolygon(prediction.polygon);
    }
    if (valueKey in prediction && prediction[valueKey] !== null) {
      this.value = prediction[valueKey];
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

export class TypedField extends Field {
  type: string;

  constructor({
    prediction,
    valueKey = "value",
    reconstructed = false,
    pageNumber,
  }: FieldConstructor) {
    super({ prediction, valueKey, reconstructed, pageNumber });
    this.type = prediction.type;
  }
}
