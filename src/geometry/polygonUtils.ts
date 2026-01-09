import { MinMax } from "./minMax.js";
import { Point } from "./point.js";

/**
 * Get the central point (centroid) given a list of points.
 */
export function getCentroid(vertices: Array<Point>): Point {
  const numbVertices = vertices.length;
  const xSum = vertices
    .map((point) => point[0])
    .reduce((prev, cur) => prev + cur);
  const ySum = vertices
    .map((point) => point[1])
    .reduce((prev, cur) => prev + cur);
  return [xSum / numbVertices, ySum / numbVertices];
}

/**
 * Determine if a Point is within two Y coordinates.
 */
export function isPointInY(
  centroid: Point,
  yMin: number,
  yMax: number
): boolean {
  return yMin <= centroid[1] && centroid[1] <= yMax;
}

/**
 * Get the maximum and minimum Y coordinates in a given list of Points.
 */
export function getMinMaxY(vertices: Array<Point>): MinMax {
  const points = vertices.map((point) => point[1]);
  return { min: Math.min(...points), max: Math.max(...points) };
}

/**
 * Determine if a Point is within a Polygon's Y axis.
 */
export function isPointInPolygonY(centroid: Point, polygon: Array<Point>): boolean {
  const yCoords = getMinMaxY(polygon);
  return isPointInY(centroid, yCoords.min, yCoords.max);
}

/**
 * Calculate the relative Y position of a Polygon.
 *
 * Can be used to order (sort) words in the same column.
 */
export function relativeY(polygon: Array<Point>): number {
  const sum: number = polygon
    .map((point) => point[1])
    .reduce((prev, cur) => prev + cur);
  return polygon.length * sum;
}

/**
 * Determine if a Point is within two X coordinates.
 */
export function isPointInX(
  centroid: Point,
  xMin: number,
  xMax: number
): boolean {
  return xMin <= centroid[0] && centroid[0] <= xMax;
}

/**
 * Get the maximum and minimum X coordinates in a given list of Points.
 */
export function getMinMaxX(vertices: Array<Point>): MinMax {
  const points = vertices.map((point) => point[0]);
  return { min: Math.min(...points), max: Math.max(...points) };
}

/**
 * Determine if a Point is within a Polygon's X axis.
 */
export function isPointInPolygonX(centroid: Point, polygon: Array<Point>): boolean {
  const xCoords = getMinMaxX(polygon);
  return isPointInX(centroid, xCoords.min, xCoords.max);
}

/**
 * Calculate the relative X position of a Polygon.
 *
 * Can be used to order (sort) words in the same line.
 */
export function relativeX(polygon: Array<Point>): number {
  const sum: number = polygon
    .map((point) => point[0])
    .reduce((prev, cur) => prev + cur);
  return polygon.length * sum;
}

export function getMinYCoordinate(polygon: Array<Point>): number {
  return polygon.sort((point1, point2) => {
    if (point1[1] < point2[1]) {
      return -1;
    } else if (point1[1] > point2[1]) {
      return 1;
    }
    return 0;
  })[0][1];
}

export function getMinXCoordinate(polygon: Array<Point>): number {
  return polygon.sort((point1, point2) => {
    if (point1[0] < point2[0]) {
      return -1;
    } else if (point1[0] > point2[0]) {
      return 1;
    }
    return 0;
  })[0][0];
}

export function compareOnY(polygon1: Array<Point>, polygon2: Array<Point>): number {
  const sort: number =
    getMinYCoordinate(polygon1) - getMinYCoordinate(polygon2);
  if (sort === 0) {
    return 0;
  }
  return sort < 0 ? -1 : 1;
}

export function compareOnX(polygon1: Array<Point>, polygon2: Array<Point>): number {
  const sort: number =
    getMinXCoordinate(polygon1) - getMinXCoordinate(polygon2);
  if (sort === 0) {
    return 0;
  }
  return sort < 0 ? -1 : 1;
}

export function adjustForRotation(polygon: Array<Point>, orientation: number): Array<Point> {
  if (orientation === 90) {
    return polygon.map(([x, y]) => [y, 1 - x]);
  }

  if (orientation === 180) {
    return polygon.map(([x, y]) => [1 - x, 1 - y]);
  }

  if (orientation === 270) {
    return polygon.map(([x, y]) => [1 - y, x]);
  }

  return polygon;
}
