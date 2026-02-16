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

    assert.strictEqual(mergedBbox.xMin, 0.081);
    assert.strictEqual(mergedBbox.yMin, 0.442);
    assert.strictEqual(mergedBbox.xMax, 0.26);
    assert.strictEqual(mergedBbox.yMax, 0.451);
  });

  it("should get a polygon's bbox", () => {
    const bboxA = getBbox(polygonA);
    assert.strictEqual(bboxA.xMin, 0.123);
    assert.strictEqual(bboxA.yMin, 0.53);
    assert.strictEqual(bboxA.xMax, 0.175);
    assert.strictEqual(bboxA.yMax, 0.546);

    const bboxB = getBbox(polygonB);
    assert.strictEqual(bboxB.xMin, 0.124);
    assert.strictEqual(bboxB.yMin, 0.535);
    assert.strictEqual(bboxB.xMax, 0.19);
    assert.strictEqual(bboxB.yMax, 0.546);

    const bboxC = getBbox(polygonC);
    assert.strictEqual(bboxC.xMin, 0.205);
    assert.strictEqual(bboxC.yMin, 0.407);
    assert.strictEqual(bboxC.xMax, 0.381);
    assert.strictEqual(bboxC.yMax, 0.43);
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
