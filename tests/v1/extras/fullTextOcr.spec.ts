import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "path";
import * as fs from "node:fs/promises";
import { AsyncPredictResponse } from "@/v1/index.js";
import { InternationalIdV2 } from "@/v1/product/index.js";
import { RESOURCE_PATH } from "../../index.js";

const fullTextOcrDir = path.join(RESOURCE_PATH, "v1/extras/full_text_ocr");

async function loadDocument() {
  const jsonData = await fs.readFile(path.join(fullTextOcrDir, "complete.json"));
  return new AsyncPredictResponse(
    InternationalIdV2, JSON.parse(jsonData.toString())
  ).document?.extras?.fullTextOcr.toString();
}

describe("MindeeV1 - Full Text Ocr", async () => {
  it("should load a Full Text OCR prediction at document level", async () => {
    const expectedText = (await fs.readFile(path.join(fullTextOcrDir, "full_text_ocr.txt")))
      .toString();
    const fullTextOcr = await loadDocument();
    assert.strictEqual(fullTextOcr, expectedText.trim());
  });
});
