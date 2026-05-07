import { loadOptionalDependency } from "@/dependency/index.js";
import { ExtractedImage } from "@/image/index.js";
import { PathInput } from "@/index.js";
import { extractCrops } from "@/v2/fileOperations/crop.js";

import { LocalResponse } from "@/v2/parsing/index.js";
import { CropResponse } from "@/v2/product/crop/cropResponse.js";
import type * as pdfLibTypes from "@cantoo/pdf-lib";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "path";
import type * as SharpTypes from "sharp";
import { V2_PRODUCT_PATH } from "../../index.js";

const cropPath = path.join(V2_PRODUCT_PATH, "crop");
let pdfLib: typeof pdfLibTypes | null = null;

async function getPdfLib(): Promise<typeof pdfLibTypes> {
  if (!pdfLib) {
    const pdfLibImport = await loadOptionalDependency<typeof pdfLibTypes>("@cantoo/pdf-lib", "Text Embedding");
    pdfLib = (pdfLibImport as any).default || pdfLibImport;
  }
  return pdfLib!;
}

async function loadV2Crop(resourcePath: string): Promise<CropResponse> {
  const localResponse = new LocalResponse(resourcePath);
  return localResponse.deserializeResponse(CropResponse);
}
/**
 * Gets dimensions of a buffer, routing to pdf-lib for PDFs and sharp for images.
 */
async function getFileDimensions(buffer: Buffer, sharpInstance: any) {
  const isPdf = buffer.subarray(0, 4).toString("ascii") === "%PDF";
  const pdfLib = await getPdfLib();
  if (isPdf) {
    const pdfDoc = await pdfLib.PDFDocument.load(buffer);
    const page = pdfDoc.getPage(0);
    const { width, height } = page.getSize();

    return { width, height };
  }
  const metadata = await sharpInstance(buffer).metadata();
  return { width: metadata.width, height: metadata.height };

}

describe("MindeeV2 - FileOperation - Crop #OptionalDepsRequired", async () => {
  const sharpLoaded = await loadOptionalDependency<typeof SharpTypes>("sharp", "Image compression");
  const sharp = (sharpLoaded as any).default || sharpLoaded;

  await it("should process single page crop correctly", async () => {
    const inputSample = new PathInput({
      inputPath:
          path.join(cropPath, "default_sample.jpg")
    });
    const response = await loadV2Crop(
      path.join(cropPath, "default_sample.json")
    );

    const extractedCrops = await response.extractFromFile(inputSample);

    assert.strictEqual(extractedCrops.length, 2);

    assert.strictEqual(extractedCrops[0].pageId, 0);
    const dimensions = await getFileDimensions(extractedCrops[0].buffer, sharp);
    assert.strictEqual(Math.round(dimensions.width), 2201);
    assert.strictEqual(Math.round(dimensions.height), 4314);
    const localExtract: ExtractedImage = await response.inference.result.crops[0].extractFromFile(inputSample);
    assert.ok(localExtract.buffer.equals(extractedCrops[0].buffer));
  });

  await it("should extract and still work with lower quality", async () => {
    const inputSample = new PathInput({
      inputPath:
        path.join(cropPath, "default_sample.jpg")
    });
    const response = await loadV2Crop(
      path.join(cropPath, "default_sample.json")
    );

    const extractedCrops = await response.extractFromFile(inputSample, 0.5);

    assert.strictEqual(extractedCrops.length, 2);

    assert.strictEqual(extractedCrops[0].pageId, 0);
    const dimensions = await getFileDimensions(extractedCrops[0].buffer, sharp);
    assert.strictEqual(Math.round(dimensions.width), Math.round(2201 * 0.5));
    assert.strictEqual(Math.round(dimensions.height), Math.round(4314 * 0.5));
    const localExtract: ExtractedImage = await response.inference.result.crops[0].extractFromFile(inputSample, 0.5);
    assert.ok(localExtract.buffer.equals(extractedCrops[0].buffer));
  });

  await it("should process multi page receipt crops correctly", async () => {
    const inputSample = new PathInput({
      inputPath:
        path.join(cropPath, "multipage_sample.pdf")
    });
    const response = await loadV2Crop(
      path.join(cropPath, "crop_multiple.json")
    );

    const extractedCrops = await extractCrops(
      inputSample,
      response.inference.result.crops
    );

    assert.strictEqual(extractedCrops.length, 2);

    assert.strictEqual(extractedCrops[0].pageId, 0);
    assert.strictEqual(extractedCrops[0].elementId, 0);

    const dimensions1 = await getFileDimensions(extractedCrops[0].buffer, sharp);
    assert.strictEqual(Math.round(dimensions1.width), 325);
    assert.strictEqual(Math.round(dimensions1.height), 1579);

    assert.strictEqual(extractedCrops[1].pageId, 0);
    assert.strictEqual(extractedCrops[1].elementId, 1);
    const dimensions2 = await getFileDimensions(extractedCrops[1].buffer, sharp);
    assert.strictEqual(Math.round(dimensions2.width), 391);
    assert.strictEqual(Math.round(dimensions2.height), 1439);
  });
});
