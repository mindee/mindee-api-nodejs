import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Polygon } from "@/geometry/index.js";
import { crop } from "@/v2/product/index.js";

import { V2_PRODUCT_PATH } from "../../index.js";
import { loadV2Response } from "./utils.js";

describe("MindeeV2 - Crop Response", async () => {
  it("should load a single result", async () => {
    const response = await loadV2Response(
      crop.CropResponse,
      path.join(V2_PRODUCT_PATH, "crop", "crop_single.json")
    );
    const inference = response.inference;

    // Validate inference metadata
    assert.strictEqual(inference.id, "12345678-1234-1234-1234-123456789abc");
    assert.strictEqual(inference.model.id, "test-model-id");

    assert.strictEqual(inference.job.id, "12345678-1234-1234-1234-jobid1234567");

    // Validate file metadata
    assert.strictEqual(inference.file.name, "sample.jpeg");
    assert.strictEqual(inference.file.pageCount, 1);
    assert.strictEqual(inference.file.mimeType, "image/jpeg");

    // Validate crops
    const crops: crop.CropItem[] = inference.result.crops;
    assert.ok(Array.isArray(crops));
    assert.strictEqual(crops.length, 1);

    const firstCrop = crops[0];
    assert.strictEqual(firstCrop.objectType, "invoice");
    assert.strictEqual(firstCrop.location.page, 0);

    const polygon: Polygon = firstCrop.location.polygon!;
    assert.strictEqual(polygon.length, 4);
    assert.strictEqual(polygon.length, 4);
    assert.strictEqual(polygon[0][0], 0.15);
    assert.strictEqual(polygon[0][1], 0.254);
    assert.strictEqual(polygon[1][0], 0.85);
    assert.strictEqual(polygon[1][1], 0.254);
    assert.strictEqual(polygon[2][0], 0.85);
    assert.strictEqual(polygon[2][1], 0.947);
    assert.strictEqual(polygon[3][0], 0.15);
    assert.strictEqual(polygon[3][1], 0.947);
  });

  it("should load multiple results", async () => {
    const response = await loadV2Response(
      crop.CropResponse,
      path.join(V2_PRODUCT_PATH, "crop", "crop_multiple.json")
    );
    const inference = response.inference;

    const job = inference.job;
    assert.strictEqual(job.id, "12345678-1234-1234-1234-jobid1234567");

    // Validate inference metadata
    assert.strictEqual(inference.id, "12345678-1234-1234-1234-123456789abc");
    assert.strictEqual(inference.model.id, "test-model-id");

    // Validate file metadata
    assert.strictEqual(inference.file.name, "default_sample.jpg");
    assert.strictEqual(inference.file.pageCount, 1);
    assert.strictEqual(inference.file.mimeType, "image/jpeg");

    const crops: crop.CropItem[] = inference.result.crops;
    assert.ok(Array.isArray(crops));
    assert.strictEqual(crops.length, 2);

    // Validate first crop item
    const firstCrop: crop.CropItem = crops[0];
    assert.strictEqual(firstCrop.objectType, "invoice");
    assert.strictEqual(firstCrop.location.page, 0);
    const firstPolygon: Polygon = firstCrop.location.polygon!;
    assert.strictEqual(firstPolygon.length, 4);
    assert.strictEqual(firstPolygon[0][0], 0.214);
    assert.strictEqual(firstPolygon[0][1], 0.079);
    assert.strictEqual(firstPolygon[1][0], 0.476);
    assert.strictEqual(firstPolygon[1][1], 0.079);
    assert.strictEqual(firstPolygon[2][0], 0.476);
    assert.strictEqual(firstPolygon[2][1], 0.979);
    assert.strictEqual(firstPolygon[3][0], 0.214);
    assert.strictEqual(firstPolygon[3][1], 0.979);

    // Validate second crop item
    const secondCrop: crop.CropItem = crops[1];
    assert.strictEqual(secondCrop.objectType, "invoice");
    assert.strictEqual(secondCrop.location.page, 0);
    const secondPolygon: Polygon = secondCrop.location.polygon!;
    assert.strictEqual(secondPolygon.length, 4);
    assert.strictEqual(secondPolygon[0][0], 0.547);
    assert.strictEqual(secondPolygon[0][1], 0.15);
    assert.strictEqual(secondPolygon[1][0], 0.862);
    assert.strictEqual(secondPolygon[1][1], 0.15);
    assert.strictEqual(secondPolygon[2][0], 0.862);
    assert.strictEqual(secondPolygon[2][1], 0.97);
    assert.strictEqual(secondPolygon[3][0], 0.547);
    assert.strictEqual(secondPolygon[3][1], 0.97);
  });
});
