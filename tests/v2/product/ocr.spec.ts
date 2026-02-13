import { expect } from "chai";
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
    expect(response.inference.id).to.equal("12345678-1234-1234-1234-123456789abc");
    expect(response.inference.model.id).to.equal("test-model-id");

    // Validate file metadata
    expect(response.inference.file.name).to.equal("default_sample.jpg");
    expect(response.inference.file.pageCount).to.equal(1);
    expect(response.inference.file.mimeType).to.equal("image/jpeg");

    // Validate pages
    const pages: ocr.OcrPage[] = response.inference.result.pages;
    expect(pages).to.be.an("array").that.has.lengthOf(1);

    // Validate first page
    const firstPage: ocr.OcrPage = pages[0];
    expect(firstPage.words).to.be.an("array");

    // Check first word
    const firstWord: ocr.OcrWord = firstPage.words[0];
    expect(firstWord.content).to.equal("Shipper:");
    const firstPolygon: Polygon = firstWord.polygon;
    expect(firstPolygon.length).to.equal(4);

    // Check another word (5th word: "INC.")
    const fifthWord: ocr.OcrWord = firstPage.words[4];
    expect(fifthWord.content).to.equal("INC.");
    const fifthPolygon: Polygon = fifthWord.polygon;
    expect(fifthPolygon.length).to.equal(4);
  });

  it("should load multiple results", async () => {
    const response = await loadV2Response(
      ocr.OcrResponse,
      path.join(V2_PRODUCT_PATH, "ocr", "ocr_multiple.json")
    );
    const pages: ocr.OcrPage[] = response.inference.result.pages;
    expect(pages).to.be.an("array").that.has.lengthOf(3);

    // Validate that each page has words and content
    pages.forEach((page: ocr.OcrPage): void => {
      expect(page.words).to.be.an("array");
      expect(page.content).to.be.a("string");
    });
  });
});
