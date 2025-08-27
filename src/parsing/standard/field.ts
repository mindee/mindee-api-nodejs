import { BaseField, BaseFieldConstructor } from "./base";
import { Polygon, BoundingBox, getBoundingBox } from "../../geometry";

/**
 * A basic field with position and page information.
 */
export class Field extends BaseField {
  /**
   * Contains exactly 4 relative vertices coordinates (points) of a right
   * rectangle containing the field in the document.
   */
  boundingBox: BoundingBox;
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon = new Polygon();
  /** The confidence score of the prediction. */
  confidence: number;

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

    this.confidence = prediction["confidence"] ? prediction["confidence"] : 0.0;
    if (prediction["polygon"]) {
      this.polygon = prediction["polygon"];
    }
    this.boundingBox = getBoundingBox(this.polygon);
  }

  /**
  @param array1 first Array of Fields
  @param array2 second Array of Fields
  @param attr Attribute to compare
  @returns true if all elements in array1 exist in array2 and vice-versa, false otherwise
   */
  static compareArrays(
    array1: Field[],
    array2: Field[],
    attr: string = "value"
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
   * @param {Field[]} array - Array of Fields
   * @returns {number} product of all the fields probability
   */
  static arrayConfidence(array: Field[]): number {
    let total = 1.0;
    for (const field of array) {
      total *= field.confidence;
      if (isNaN(total)) return 0.0;
    }
    return total;
  }
}
