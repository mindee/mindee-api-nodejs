import { Point } from "./point";

/** A simple bounding box defined by 4 coordinates: xMin, yMin, xMax, yMax */
export type BBox = [number, number, number, number];

/** A bounding box defined by 4 points. */
export type BoundingBox = [Point, Point, Point, Point];