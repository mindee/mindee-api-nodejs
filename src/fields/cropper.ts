import { BaseField, FieldConstructor } from "./field";
import { Polygon } from "../geometry";

export class CropperField extends BaseField {
  /** Straight rectangle. */
  boundingBox: Polygon;
  /** Free polygon with up to 30 vertices. */
  polygon: Polygon;
  /** Free polygon with 4 vertices. */
  quadrangle: Polygon;
  /** Rectangle that may be oriented (can go beyond the canvas). */
  rectangle: Polygon;
  /** The document page on which the information was found. */
  pageId: number | undefined;

  constructor({ prediction, valueKey = "polygon", pageId }: FieldConstructor) {
    super({ prediction, valueKey });
    this.pageId = pageId;
    this.boundingBox = prediction.bounding_box;
    this.polygon = prediction.polygon;
    this.quadrangle = prediction.quadrangle;
    this.rectangle = prediction.rectangle;
  }

  toString(): string {
    return `Polygon with ${this.polygon.length} points.`;
  }
}
