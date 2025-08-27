import { Point } from "./point";

/** A polygon, composed of several Points. */
export class Polygon extends Array<Point> {

  constructor(...args: Point[]) {
    super(...args);
  }
}
