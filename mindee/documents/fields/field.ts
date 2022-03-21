export interface FieldConstructor {
  prediction: any;
  valueKey?: string;
  reconstructed?: boolean;
  extraFields?: any;
  pageNumber?: number | undefined;
}

export class Field {
  bbox: any;
  pageNumber: number | undefined;
  confidence: number;
  reconstructed: boolean;
  value: any;
  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageNumber - Page number for multi pages pdf
   * @param {Array<String>} extraFields - Extra fields to get from the prediction and to set as attribute of the Field
   */
  constructor({
    prediction,
    valueKey = "value",
    reconstructed = false,
    extraFields,
    pageNumber,
  }: FieldConstructor) {
    this.pageNumber = pageNumber;
    this.reconstructed = reconstructed;
    this.value = undefined;
    this.confidence = prediction.confidence ? prediction.confidence : 0.0;
    this.bbox = prediction.polygon ? prediction.polygon : [];
    if (valueKey in prediction && prediction[valueKey] !== null) {
      this.value = prediction[valueKey];
      if (extraFields) {
        for (const fieldName of extraFields) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this[fieldName] = prediction[fieldName];
        }
      }
    }
  }

  compare(other: any) {
    if (this.value == null && other.value == null) return true;
    else if (this.value == null || other.value == null) return false;
    else {
      if (typeof this.value == "string") {
        return this.value.toLowerCase() === other.value.toLowerCase();
      } else {
        return this.value === other.value;
      }
    }
  }

  /**
  @param {Array<Field>} array1 - first Array of Fields
  @param {Array<Field>} array2 - second Array of Fields
  @param {String} attr - Attribute to compare
  @returns {Boolean} - true if all elements in array1 exist in array2 and vice-versa, false otherwise
   */
  static compareArrays(array1: any, array2: any, attr = "value"): boolean {
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
  static arrayProbability(array: any): number {
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
    let total = 0;
    for (const field of array) {
      total += field.value;
      if (isNaN(total)) return 0.0;
    }
    return total;
  }
}
