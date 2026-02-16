import { BoundingBox } from "./boundingBox.js";
import { BBox } from "./bbox.js";
import { Polygon } from "./polygon.js";

/**
 * Given a Polygon, calculate a polygon that encompasses all points.
 */
export function getBoundingBox(polygon: Polygon): BoundingBox {
  const bbox = getBbox(polygon);
  return getBoundingBoxFromBBox(bbox);
}

/**
 * Given a BBox, generate the associated bounding box.
 */
export function getBoundingBoxFromBBox(bbox: BBox): BoundingBox {
  return new BoundingBox(
    [bbox.xMin, bbox.yMin],
    [bbox.xMax, bbox.yMin],
    [bbox.xMax, bbox.yMax],
    [bbox.xMin, bbox.yMax],
  );
}

/**
 * Given 2 bbox, merge them.
 */
export function mergeBbox(bbox1: BBox, bbox2: BBox): BBox {
  return new BBox(
    Math.min(bbox1.xMin, bbox2.xMin),
    Math.min(bbox1.yMin, bbox2.yMin),
    Math.max(bbox1.xMax, bbox2.xMax),
    Math.max(bbox1.yMax, bbox2.yMax),
  );
}

/**
 * Given a Polygon, calculate a BBox that encompasses all points.
 */
export function getBbox(polygon: Polygon): BBox {
  const allY: number[] = polygon.map((point) => point[1]);
  const allX: number[] = polygon.map((point) => point[0]);
  return new BBox(
    Math.min(...allX),
    Math.min(...allY),
    Math.max(...allX),
    Math.max(...allY),
  );
}

/**
 * Given polygons, calculate a BBox that encompasses all points.
 */
export function getBBoxForPolygons(polygons: Polygon[]): BBox {
  const allY = polygons.flatMap((polygon) => polygon.map((point) => point[1]));
  const allX = polygons.flatMap((polygon) => polygon.map((point) => point[0]));
  return new BBox(
    Math.min(...allX),
    Math.min(...allY),
    Math.max(...allX),
    Math.max(...allY),
  );
}
