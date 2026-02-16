import { Point } from "./point.js";
import { Polygon } from "./polygon.js";

/** A bounding box defined by 4 points. */
export class BoundingBox extends Polygon {
  constructor(topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point) {
    super(topLeft, topRight, bottomRight, bottomLeft);
  }
}
