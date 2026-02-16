import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Point, getCentroid } from "@/geometry/index.js";
import { polygonA, polygonB, polygonC } from "./constants.js";

describe("Geometry functions - Polygon", () => {

  it("should calculate a polygon's centroid", () => {
    const utilsCentroid = getCentroid(polygonA);
    const polygonCentroid = polygonA.getCentroid();
    const expectedCentroid = [0.149, 0.538];
    assert.deepStrictEqual(utilsCentroid, expectedCentroid);
    assert.deepStrictEqual(polygonCentroid, expectedCentroid);
  });

  it("should determine if two polygons are on the same line", () => {
    // Should be in polygon A & B, since polygons overlap
    const pointA: Point = [0.125, 0.535];
    // Should only be in polygon C
    const pointB: Point = [0.3, 0.42];

    assert.ok(polygonA.isPointInY(pointA));
    assert.ok(polygonB.isPointInY(pointA));
    assert.ok(!polygonC.isPointInY(pointA));

    assert.ok(!polygonA.isPointInY(pointB));
    assert.ok(!polygonB.isPointInY(pointB));
    assert.ok(polygonC.isPointInY(pointB));
  });

  it("should determine if two polygons are on the same column", () => {
    // Should be in polygon A & B, since polygons overlap
    const pointA: Point = [0.125, 0.535];
    // Should only be in polygon C
    const pointB: Point = [0.3, 0.42];

    assert.ok(polygonA.isPointInX(pointA));
    assert.ok(polygonB.isPointInX(pointA));
    assert.ok(!polygonC.isPointInX(pointA));

    assert.ok(!polygonA.isPointInX(pointB));
    assert.ok(!polygonB.isPointInX(pointB));
    assert.ok(polygonC.isPointInX(pointB));
  });
});
