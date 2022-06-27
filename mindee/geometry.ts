type Point = [number, number];
type MinMax = { min: number; max: number };
export type BoundingBox = [number, number, number, number];
export type Polygon = Array<Point>;

/**
 * Given a Polygon, calculate a polygon that encompasses all points.
 */
export function getBboxAsPolygon(polygon: Polygon): Polygon {
  const bbox = getBbox(polygon);
  return [
    [bbox[0], bbox[1]],
    [bbox[2], bbox[1]],
    [bbox[2], bbox[3]],
    [bbox[0], bbox[3]],
  ];
}

/**
 * Given a Polygon, calculate a bounding box that encompasses all points.
 */
export function getBbox(polygon: Polygon): BoundingBox {
  const allY = polygon.map((point) => point[1]);
  const allX = polygon.map((point) => point[0]);
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
export function isPointInPolygonY(
  centroid: Point,
  minY: number,
  maxY: number
): boolean {
  return minY <= centroid[1] && centroid[1] <= maxY;
}

/**
 * Get the maximum and minimum Y coordinates in a given list of Points.
 */
export function getMinMaxY(vertices: Array<Point>): MinMax {
  const points = vertices.map((point) => point[1]);
  return { min: Math.min(...points), max: Math.max(...points) };
}
