import { Point } from "./point";
import { getCentroid, getMinMaxX, getMinMaxY, isPointInX, isPointInY } from "./polygonUtils";
import { MinMax } from "./minMax";

/** A polygon, composed of several Points. */
export class Polygon extends Array<Point> {

  constructor(...args: Point[]) {
    super(...args);
  }

  /**
   * Get the central point (centroid) of the polygon.
   */
  public getCentroid(): Point {
    return getCentroid(this);
  }

  /**
   * Get the maximum and minimum X coordinates of the polygon.
   */
  public getMinMaxX(): MinMax {
    return getMinMaxX(this);
  }

  /**
   * Get the maximum and minimum Y coordinates of the polygon.
   */
  public getMinMaxY(): MinMax {
    return getMinMaxY(this);
  }

  /**
   * Determine if a Point is within the Polygon's X axis (same column).
   */
  public isPointInX(point: Point): boolean {
    const xCoords = this.getMinMaxX();
    return isPointInX(point, xCoords.min, xCoords.max);
  }

  /**
   * Determine if a Point is within the Polygon's Y axis (same line).
   */
  public isPointInY(point: Point): boolean {
    const yCoords = this.getMinMaxY();
    return isPointInY(point, yCoords.min, yCoords.max);
  }
}
