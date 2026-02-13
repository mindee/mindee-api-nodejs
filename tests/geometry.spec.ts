import * as geometry from "@/geometry/index.js";
import assert from "node:assert/strict";

describe("Geometry functions", () => {
  // 90° rectangle, overlaps polygonB
  const polygonA = new geometry.Polygon(
    [0.123, 0.53],
    [0.175, 0.53],
    [0.175, 0.546],
    [0.123, 0.546],
  );

  // 90° rectangle, overlaps polygonA
  const polygonB = new geometry.Polygon(
    [0.124, 0.535],
    [0.19, 0.535],
    [0.19, 0.546],
    [0.124, 0.546],
  );

  // not 90° rectangle, doesn't overlap any polygons
  const polygonC = new geometry.Polygon(
    [0.205, 0.407],
    [0.379, 0.407],
    [0.381, 0.43],
    [0.207, 0.43],
  );

  it("should get a polygon's bbox", () => {
    const bboxA = geometry.getBbox(polygonA);
    assert.strictEqual(bboxA.xMin, 0.123);
    assert.strictEqual(bboxA.yMin, 0.53);
    assert.strictEqual(bboxA.xMax, 0.175);
    assert.strictEqual(bboxA.yMax, 0.546);

    const bboxB = geometry.getBbox(polygonB);
    assert.strictEqual(bboxB.xMin, 0.124);
    assert.strictEqual(bboxB.yMin, 0.535);
    assert.strictEqual(bboxB.xMax, 0.19);
    assert.strictEqual(bboxB.yMax, 0.546);

    const bboxC = geometry.getBbox(polygonC);
    assert.strictEqual(bboxC.xMin, 0.205);
    assert.strictEqual(bboxC.yMin, 0.407);
    assert.strictEqual(bboxC.xMax, 0.381);
    assert.strictEqual(bboxC.yMax, 0.43);
  });

  it("should get a polygon's bounding box", () => {
    assert.deepStrictEqual(
      geometry.getBoundingBox(polygonA),
      new geometry.BoundingBox(
        [0.123, 0.53],
        [0.175, 0.53],
        [0.175, 0.546],
        [0.123, 0.546],
      )
    );
    assert.deepStrictEqual(
      geometry.getBoundingBox(polygonB),
      new geometry.BoundingBox(
        [0.124, 0.535],
        [0.19, 0.535],
        [0.19, 0.546],
        [0.124, 0.546],
      )
    );
    assert.deepStrictEqual(
      geometry.getBoundingBox(polygonC),
      new geometry.BoundingBox(
        [0.205, 0.407],
        [0.381, 0.407],
        [0.381, 0.43],
        [0.205, 0.43],
      )
    );
  });

  it("should calculate a polygon's centroid", () => {
    const utilsCentroid = geometry.getCentroid(polygonA);
    const polygonCentroid = polygonA.getCentroid();
    const expectedCentroid = [0.149, 0.538];
    assert.deepStrictEqual(utilsCentroid, expectedCentroid);
    assert.deepStrictEqual(polygonCentroid, expectedCentroid);
  });

  it("should determine if two polygons are on the same line", () => {
    // Should be in polygon A & B, since polygons overlap
    const pointA: geometry.Point = [0.125, 0.535];
    // Should only be in polygon C
    const pointB: geometry.Point = [0.3, 0.42];

    assert.ok(geometry.isPointInPolygonY(pointA, polygonA));
    assert.ok(polygonA.isPointInY(pointA));
    assert.ok(geometry.isPointInPolygonY(pointA, polygonB));
    assert.ok(polygonB.isPointInY(pointA));
    assert.ok(!geometry.isPointInPolygonY(pointA, polygonC));
    assert.ok(!polygonC.isPointInY(pointA));

    assert.ok(!geometry.isPointInPolygonY(pointB, polygonA));
    assert.ok(!polygonA.isPointInY(pointB));
    assert.ok(!geometry.isPointInPolygonY(pointB, polygonB));
    assert.ok(!polygonB.isPointInY(pointB));
    assert.ok(geometry.isPointInPolygonY(pointB, polygonC));
    assert.ok(polygonC.isPointInY(pointB));
  });

  it("should determine if two polygons are on the same column", () => {
    // Should be in polygon A & B, since polygons overlap
    const pointA: geometry.Point = [0.125, 0.535];
    // Should only be in polygon C
    const pointB: geometry.Point = [0.3, 0.42];

    assert.ok(geometry.isPointInPolygonX(pointA, polygonA));
    assert.ok(polygonA.isPointInX(pointA));
    assert.ok(geometry.isPointInPolygonX(pointA, polygonB));
    assert.ok(polygonB.isPointInX(pointA));
    assert.ok(!geometry.isPointInPolygonX(pointA, polygonC));
    assert.ok(!polygonC.isPointInX(pointA));

    assert.ok(!geometry.isPointInPolygonX(pointB, polygonA));
    assert.ok(!polygonA.isPointInX(pointB));
    assert.ok(!geometry.isPointInPolygonX(pointB, polygonB));
    assert.ok(!polygonB.isPointInX(pointB));
    assert.ok(geometry.isPointInPolygonX(pointB, polygonC));
    assert.ok(polygonC.isPointInX(pointB));
  });

  it("should merge two Bbox", () => {
    const firsBBox: geometry.BBox = new geometry.BBox(
      0.081, 0.442, 0.15, 0.451
    );
    const secondBBox: geometry.BBox = new geometry.BBox(
      0.157, 0.442, 0.26, 0.451
    );
    const mergedBbox = geometry.mergeBbox(firsBBox, secondBBox);

    assert.strictEqual(mergedBbox.xMin, 0.081);
    assert.strictEqual(mergedBbox.yMin, 0.442);
    assert.strictEqual(mergedBbox.xMax, 0.26);
    assert.strictEqual(mergedBbox.yMax, 0.451);
  });
});
