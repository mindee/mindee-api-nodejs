import { Point } from "./point";

/** A simple bounding box defined by 4 coordinates: xMin, yMin, xMax, yMax */
export class BBox {
  xMin: number
  yMin: number
  xMax: number
  yMax: number

  constructor(xMin: number, yMin: number, xMax: number, yMax: number) {
    this.xMin = xMin;
    this.yMin = yMin;
    this.xMax = xMax;
    this.yMax = yMax;
  }
}

/** A bounding box defined by 4 points. */
export type BoundingBox = [Point, Point, Point, Point];
