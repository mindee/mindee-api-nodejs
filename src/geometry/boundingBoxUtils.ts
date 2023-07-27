import { BoundingBox, BBox } from "./boundingBox";
import { Polygon } from "./polygon";

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
