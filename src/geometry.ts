export type MinMax = { min: number; max: number };
/** A point on the document defined by 2 coordinates: X, Y */
export type Point = [number, number];
/** A simple bounding box defined by 4 coordinates: xMin, yMin, xMax, yMax */
export type BBox = [number, number, number, number];
/** A bounding box defined by 4 points. */
export type BoundingBox = [Point, Point, Point, Point];
/** A polygon, composed of several Points. */
export type Polygon = Array<Point>;

/**
 * Given a Polygon, calculate a polygon that encompasses all points.
 */
export function getBoundingBox(polygon: Polygon): BoundingBox {
  const bbox = getBbox(polygon);
  return [
    [bbox[0], bbox[1]],
    [bbox[2], bbox[1]],
    [bbox[2], bbox[3]],
    [bbox[0], bbox[3]],
  ];
}

/**
 * Given a BBox, generate the associated bounding box.
 */
export function getBoundingBoxFromBBox(bbox: BBox): BoundingBox {
  return [
    [bbox[0], bbox[1]],
    [bbox[2], bbox[1]],
    [bbox[2], bbox[3]],
    [bbox[0], bbox[3]],
  ];
}

/**
 * Given 2 bbox, merge them.
 */
export function mergeBbox(bbox1: BBox, bbox2: BBox): BBox {
  return [
    Math.min(bbox1[0], bbox2[0]),
    Math.min(bbox1[1], bbox2[1]),
    Math.max(bbox1[2], bbox2[2]),
    Math.max(bbox1[3], bbox2[3]),
  ];
}

/**
 * Given a Polygon, calculate a bounding box that encompasses all points.
 */
export function getBbox(polygon: Polygon): BBox {
  const allY = polygon.map((point) => point[1]);
  const allX = polygon.map((point) => point[0]);
  const yMin = Math.min(...allY);
  const yMax = Math.max(...allY);
  const xMin = Math.min(...allX);
  const xMax = Math.max(...allX);
  return [xMin, yMin, xMax, yMax];
}

/**
 * Given polygons, calculate a bounding box that encompasses all points.
 */
export function getBBoxForPolygons(polygons: Polygon[]): BBox {
  const allY = polygons.flatMap((polygon) => polygon.map((point) => point[1]));
  const allX = polygons.flatMap((polygon) => polygon.map((point) => point[0]));
  const yMin = Math.min(...allY);
  const yMax = Math.max(...allY);
  const xMin = Math.min(...allX);
  const xMax = Math.max(...allX);
  return [xMin, yMin, xMax, yMax];
}

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
export function isPointInPolygonY(centroid: Point, polygon: Polygon): boolean {
  const yCoords = getMinMaxY(polygon);
  return isPointInY(centroid, yCoords.min, yCoords.max);
}

/**
 * Calculate the relative Y position of a Polygon.
 *
 * Can be used to order (sort) words in the same column.
 */
export function relativeY(polygon: Polygon): number {
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
export function isPointInPolygonX(centroid: Point, polygon: Polygon): boolean {
  const xCoords = getMinMaxX(polygon);
  return isPointInX(centroid, xCoords.min, xCoords.max);
}

/**
 * Calculate the relative X position of a Polygon.
 *
 * Can be used to order (sort) words in the same line.
 */
export function relativeX(polygon: Polygon): number {
  const sum: number = polygon
    .map((point) => point[0])
    .reduce((prev, cur) => prev + cur);
  return polygon.length * sum;
}
