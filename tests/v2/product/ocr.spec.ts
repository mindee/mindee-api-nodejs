import assert from "node:assert/strict";
import path from "node:path";
import { ocr } from "@/v2/product/index.js";
import { Polygon } from "@/geometry/index.js";

import { V2_PRODUCT_PATH } from "../../index.js";
import { loadV2Response } from "./utils.js";


describe("MindeeV2 - OCR Response", async () => {
  it("should load a single result", async () => {
    const response = await loadV2Response(
      ocr.OcrResponse,
      path.join(V2_PRODUCT_PATH, "ocr", "ocr_single.json")
    );
    // Validate inference metadata
    assert.strictEqual(response.inference.id, "12345678-1234-1234-1234-123456789abc");
    assert.strictEqual(response.inference.model.id, "test-model-id");

    // Validate file metadata
    assert.strictEqual(response.inference.file.name, "default_sample.jpg");
    assert.strictEqual(response.inference.file.pageCount, 1);
    assert.strictEqual(response.inference.file.mimeType, "image/jpeg");

    // Validate pages
    const pages: ocr.OcrPage[] = response.inference.result.pages;
    assert.ok(Array.isArray(pages));
    assert.strictEqual(pages.length, 1);

    // Validate first page
    const firstPage: ocr.OcrPage = pages[0];
    assert.ok(Array.isArray(firstPage.words));

    // Check first word
    const firstWord: ocr.OcrWord = firstPage.words[0];
    assert.strictEqual(firstWord.content, "Shipper:");
    const firstPolygon: Polygon = firstWord.polygon;
    assert.strictEqual(firstPolygon.length, 4);

    // Check another word (5th word: "INC.")
    const fifthWord: ocr.OcrWord = firstPage.words[4];
    assert.strictEqual(fifthWord.content, "INC.");
    const fifthPolygon: Polygon = fifthWord.polygon;
    assert.strictEqual(fifthPolygon.length, 4);
  });

  it("should load multiple results", async () => {
    const response = await loadV2Response(
      ocr.OcrResponse,
      path.join(V2_PRODUCT_PATH, "ocr", "ocr_multiple.json")
    );
    const pages: ocr.OcrPage[] = response.inference.result.pages;
    assert.ok(Array.isArray(pages));
    assert.strictEqual(pages.length, 3);

    // Validate that each page has words and content
    pages.forEach((page: ocr.OcrPage): void => {
      assert.ok(Array.isArray(page.words));
      assert.strictEqual(typeof page.content, "string");
    });
  });
});
