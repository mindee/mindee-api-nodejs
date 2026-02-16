import { Polygon } from "@/geometry/index.js";

// 90° rectangle, overlaps polygonB
export const polygonA = new Polygon(
  [0.123, 0.53],
  [0.175, 0.53],
  [0.175, 0.546],
  [0.123, 0.546],
);

// 90° rectangle, overlaps polygonA
export const polygonB = new Polygon(
  [0.124, 0.535],
  [0.19, 0.535],
  [0.19, 0.546],
  [0.124, 0.546],
);

// not 90° rectangle, doesn't overlap any polygons
export const polygonC = new Polygon(
  [0.205, 0.407],
  [0.379, 0.407],
  [0.381, 0.43],
  [0.207, 0.43],
);
