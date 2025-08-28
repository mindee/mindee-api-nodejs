import { Point } from "./point";
import { Polygon } from "./polygon";

/** A simple bounding box defined by 4 coordinates: xMin, yMin, xMax, yMax */
export class BBox {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;

  constructor(xMin: number, yMin: number, xMax: number, yMax: number) {
    this.xMin = xMin;
    this.yMin = yMin;
    this.xMax = xMax;
    this.yMax = yMax;
  }
}

/** A bounding box defined by 4 points. */
export class BoundingBox extends Polygon {
  constructor(topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point) {
    super(topLeft, topRight, bottomRight, bottomLeft);
  }
}
