import path from "path";
import assert from "node:assert/strict";
import { promises as fs } from "fs";
import { describe, it } from "node:test";
import { Polygon } from "@/geometry/index.js";
import { crop } from "@/v2/product/index.js";
import { ExtractionResponse } from "@/v2/product/index.js";

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

    const rstString = await fs.readFile(
      path.join(V2_PRODUCT_PATH, "crop", "crop_single.rst"), "utf8"
    );
    assert.strictEqual(response.inference.toString(), rstString);
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
    assert.strictEqual(secondCrop.objectType, "receipt");
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

    const rstString = await fs.readFile(
      path.join(V2_PRODUCT_PATH, "crop", "crop_multiple.rst"), "utf8"
    );
    assert.strictEqual(response.inference.toString(), rstString);
  });

  it("should load extraction properties", async () => {
    const response = await loadV2Response(
      crop.CropResponse,
      path.join(V2_PRODUCT_PATH, "crop", "default_sample_extraction.json")
    );
    assert.ok(response.inference);

    const crops: crop.CropItem[] = response.inference.result.crops;
    assert.strictEqual(crops.length, 2);

    const crop0 = crops[0];
    assert.strictEqual(crop0.objectType, "receipt");
    assert.ok(crop0.location.polygon);
    assert.strictEqual(crop0.location.page, 0);
    const extractionResponse0: ExtractionResponse = crop0.extractionResponse!;
    assert.ok(extractionResponse0);
    assert.strictEqual(
      extractionResponse0.inference.result.fields.getSimpleField("supplier_name").stringValue,
      "CHEZ ALAIN MIAM MIAM"
    );

    const crop1 = crops[1];
    assert.strictEqual(crop1.objectType, "receipt");
    assert.ok(crop1.location.polygon);
    assert.strictEqual(crop1.location.page, 0);
    const extractionResponse1: ExtractionResponse = crop1.extractionResponse!;
    assert.ok(extractionResponse1);
    assert.strictEqual(
      extractionResponse1.inference.result.fields.getSimpleField("supplier_name").stringValue,
      "La cerise sur la pizza"
    );
  });
});
