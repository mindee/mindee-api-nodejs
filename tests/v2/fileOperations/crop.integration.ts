import { after, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import * as fs from "node:fs";

import { Client, PathInput, BufferInput } from "@/index.js";
import { Crop } from "@/v2/product/crop/index.js";
import { Extraction, ExtractionResponse } from "@/v2/product/extraction/index.js";
import { extractCrops } from "@/v2/fileOperations/crop.js";
import { V2_PRODUCT_PATH, OUTPUT_PATH } from "../../index.js";
import { SimpleField } from "@/v2/parsing/inference/field/index.js";


function checkFindocReturn(findocResponse: ExtractionResponse) {
  assert.ok(findocResponse.inference.model.id.length > 0);
  const totalAmount = findocResponse.inference.result.fields.get("total_amount") as SimpleField;
  assert.ok(totalAmount !== undefined);
  assert.ok((totalAmount.value as number) > 0);
}

describe("MindeeV2 - Integration - FileOperation - Crop #OptionalDepsRequired", { timeout: 120000 }, () => {
  let client: Client;
  let cropModelId: string;
  let findocModelId: string;

  const cropSample = path.join(
    V2_PRODUCT_PATH,
    "crop",
    "default_sample.jpg"
  );

  beforeEach(() => {
    const apiKey = process.env["MINDEE_V2_API_KEY"] ?? "";
    cropModelId = process.env["MINDEE_V2_SE_TESTS_CROP_MODEL_ID"] ?? "";
    findocModelId = process.env["MINDEE_V2_SE_TESTS_FINDOC_MODEL_ID"] ?? "";

    client = new Client({ apiKey: apiKey, debug: true });
  });

  after(() => {
    const file1 = path.join(OUTPUT_PATH, "crop_001.jpg");
    const file2 = path.join(OUTPUT_PATH, "crop_002.jpg");
    if (fs.existsSync(file1)) fs.rmSync(file1);
    if (fs.existsSync(file2)) fs.rmSync(file2);
  });

  it("extracts crops from image correctly", async () => {
    const cropInput = new PathInput({ inputPath: cropSample });
    await cropInput.init();

    const cropParams = { modelId: cropModelId };

    const response = await client.enqueueAndGetResult(
      Crop, cropInput, cropParams
    );

    assert.equal(response.inference.result.crops.length, 2);

    const extractedImages = await extractCrops(cropInput, response.inference.result.crops);

    assert.equal(extractedImages.length, 2);
    assert.equal(extractedImages[0].filename, "default_sample.jpg_page0-0.jpg");
    assert.equal(extractedImages[1].filename, "default_sample.jpg_page0-1.jpg");

    const extractionInput = new BufferInput({
      buffer: extractedImages[0].buffer,
      filename: extractedImages[0].filename
    });
    const findocParams = { modelId: findocModelId };

    const invoice0 = await client.enqueueAndGetResult(
      Extraction, extractionInput, findocParams
    );

    checkFindocReturn(invoice0);

    const file1Path = path.join(OUTPUT_PATH, "crop_001.jpg");
    const file2Path = path.join(OUTPUT_PATH, "crop_002.jpg");

    fs.writeFileSync(file1Path, extractedImages[0].buffer);
    fs.writeFileSync(file2Path, extractedImages[1].buffer);

    const stat1 = fs.statSync(file1Path);
    assert.ok(stat1.size >= 3100000 && stat1.size <= 3200000);

    const stat2 = fs.statSync(file2Path);
    assert.ok(stat2.size >= 3200000 && stat2.size <= 3300000);
  });
});
