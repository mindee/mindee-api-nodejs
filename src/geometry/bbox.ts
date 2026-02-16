import { mergeBbox } from "@/geometry/boundingBoxUtils.js";

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

  mergeBbox(bbox: BBox) {
    return mergeBbox(this, bbox);
  }
}
