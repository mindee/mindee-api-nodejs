import { stringDict } from "./field";
import { Polygon } from "../geometry";

export interface PositionConstructor {
  prediction: stringDict;
  valueKey?: string;
  pageId?: number | undefined;
}

export class Position {
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

  constructor({ prediction, pageId }: PositionConstructor) {
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
