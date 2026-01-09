import { BaseField, BaseFieldConstructor } from "@/v1/parsing/standard/index.js";

interface OrientationFieldConstructor extends BaseFieldConstructor {
  pageId: number;
}

/**
 * The clockwise rotation to apply (in degrees) to make the image upright.
 */
export class OrientationField extends BaseField {
  /** Degrees of the rotation. */
  value: number;
  /** Page id. */
  pageId!: number;

  /**
   * @param {OrientationFieldConstructor} constructor Constructor parameters.
   */
  constructor({
    prediction = {},
    valueKey = "value",
    reconstructed = false,
    pageId,
  }: OrientationFieldConstructor) {
    super({ prediction, valueKey, reconstructed });
    const orientations = [0, 90, 180, 270];
    this.pageId = pageId;
    this.value = parseInt(prediction[valueKey]);
    if (!orientations.includes(this.value)) this.value = 0;
  }

  /**
   * Default string representation.
   */
  toString() {
    return `${this.value} degrees`;
  }
}
