import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BBox,
  BoundingBox,
  getBbox,
  getBoundingBox
} from "@/geometry/index.js";
import { polygonA, polygonB, polygonC } from "./constants.js";

describe("Geometry functions - BBox", () => {
  it("should merge two Bbox", () => {
    const firsBBox: BBox = new BBox(
      0.081, 0.442, 0.15, 0.451
    );
    const secondBBox: BBox = new BBox(
      0.157, 0.442, 0.26, 0.451
    );
    const mergedBbox = firsBBox.mergeBbox(secondBBox);

    assert.ok(Math.abs(mergedBbox.xMin - 0.081) < 1e-9);
    assert.ok(Math.abs(mergedBbox.yMin - 0.442) < 1e-9);
    assert.ok(Math.abs(mergedBbox.xMax - 0.26) < 1e-9);
    assert.ok(Math.abs(mergedBbox.yMax - 0.451) < 1e-9);
  });

  it("should get a polygon's bbox", () => {
    const bboxA = getBbox(polygonA);
    assert.ok(Math.abs(bboxA.xMin - 0.123) < 1e-9);
    assert.ok(Math.abs(bboxA.yMin - 0.53) < 1e-9);
    assert.ok(Math.abs(bboxA.xMax - 0.175) < 1e-9);
    assert.ok(Math.abs(bboxA.yMax - 0.546) < 1e-9);

    const bboxB = getBbox(polygonB);
    assert.ok(Math.abs(bboxB.xMin - 0.124) < 1e-9);
    assert.ok(Math.abs(bboxB.yMin - 0.535) < 1e-9);
    assert.ok(Math.abs(bboxB.xMax - 0.19) < 1e-9);
    assert.ok(Math.abs(bboxB.yMax - 0.546) < 1e-9);

    const bboxC = getBbox(polygonC);
    assert.ok(Math.abs(bboxC.xMin - 0.205) < 1e-9);
    assert.ok(Math.abs(bboxC.yMin - 0.407) < 1e-9);
    assert.ok(Math.abs(bboxC.xMax - 0.381) < 1e-9);
    assert.ok(Math.abs(bboxC.yMax - 0.43) < 1e-9);
  });

  it("should get a polygon's bounding box", () => {
    assert.deepStrictEqual(
      getBoundingBox(polygonA),
      new BoundingBox(
        [0.123, 0.53],
        [0.175, 0.53],
        [0.175, 0.546],
        [0.123, 0.546],
      )
    );
    assert.deepStrictEqual(
      getBoundingBox(polygonB),
      new BoundingBox(
        [0.124, 0.535],
        [0.19, 0.535],
        [0.19, 0.546],
        [0.124, 0.546],
      )
    );
    assert.deepStrictEqual(
      getBoundingBox(polygonC),
      new BoundingBox(
        [0.205, 0.407],
        [0.381, 0.407],
        [0.381, 0.43],
        [0.205, 0.43],
      )
    );
  });
});
