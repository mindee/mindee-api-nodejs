import { mergeBbox } from "@/geometry/boundingBoxUtils.js";

/** A simple bounding box defined by 4 coordinates: xMin, yMin, xMax, yMax */
export class BBox {
  /** Minimum X coordinate. */
  xMin: number;
  /** Minimum Y coordinate. */
  yMin: number;
  /** Maximum X coordinate. */
  xMax: number;
  /** Maximum Y coordinate. */
  yMax: number;

  constructor(xMin: number, yMin: number, xMax: number, yMax: number) {
    this.xMin = xMin;
    this.yMin = yMin;
    this.xMax = xMax;
    this.yMax = yMax;
  }

  /** Returns a bounding box that contains this box and another one. */
  mergeBbox(bbox: BBox) {
    return mergeBbox(this, bbox);
  }
}
