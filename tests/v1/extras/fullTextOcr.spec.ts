import { promises as fs } from "fs";
import path from "path";
import { expect } from "chai";
import { AsyncPredictResponse } from "@/index.js";
import { InternationalIdV2 } from "@/product/index.js";
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
    const expectedText = (await fs.readFile(path.join(fullTextOcrDir, "full_text_ocr.txt"))).toString();
    const fullTextOcr = await loadDocument();
    expect(fullTextOcr).to.be.equals(expectedText.trim());
  });
});
