import { expect } from "chai";
import path from "node:path";
import { V2_PRODUCT_PATH } from "../../index.js";
import { OcrResponse } from "@/v2/product/index.js";
import { loadV2Response } from "./utils.js";


describe("MindeeV2 - OCR Response", async () => {
  it("should load a single result", async () => {
    const response = await loadV2Response(
      OcrResponse,
      path.join(V2_PRODUCT_PATH, "ocr", "ocr_single.json")
    );
    const pages = response.inference.result.pages;
    expect(pages).to.be.an("array").that.has.lengthOf(1);
  });

  it("should load multiple results", async () => {
    const response = await loadV2Response(
      OcrResponse,
      path.join(V2_PRODUCT_PATH, "ocr", "ocr_multiple.json")
    );
    const pages = response.inference.result.pages;
    expect(pages).to.be.an("array").that.has.lengthOf(3);
  });
});
