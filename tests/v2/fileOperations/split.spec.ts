import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { LocalResponse } from "@/v2/parsing/index.js";
import { SplitResponse } from "@/v2/product/split/splitResponse.js";
import { PathInput } from "@/index.js";
import { V2_PRODUCT_PATH } from "../../index";
import { loadOptionalDependency } from "../../../src/dependency";
import type * as pdfLibTypes from "@cantoo/pdf-lib";

const splitPath = path.join(V2_PRODUCT_PATH, "split");
const financialDocumentPath = path.join(V2_PRODUCT_PATH, "extraction", "financial_document");

let pdfLib: typeof pdfLibTypes | null = null;

async function getPdfLib(): Promise<typeof pdfLibTypes> {
  if (!pdfLib) {
    const pdfLibImport = await loadOptionalDependency<typeof pdfLibTypes>("@cantoo/pdf-lib", "PDF Parsing");
    pdfLib = (pdfLibImport as any).default || pdfLibImport;
  }
  return pdfLib!;
}

async function loadV2Split(resourcePath: string): Promise<SplitResponse> {
  const localResponse = new LocalResponse(resourcePath);
  await localResponse.init();
  return localResponse.deserializeResponse(SplitResponse);
}

/**
 * Gets the page count of a buffer, routing to pdf-lib for PDFs.
 */
async function getPageCount(buffer: Buffer): Promise<number> {
  const isPdf = buffer.subarray(0, 4).toString("ascii") === "%PDF";
  if (isPdf) {
    const pdfLib = await getPdfLib();
    const pdfDoc = await pdfLib.PDFDocument.load(buffer);
    return pdfDoc.getPageCount();
  }
  return 1;
}

describe("MindeeV2 - Product - SplitResponse #OptionalDepsRequired", async () => {

  await it("should process single page split correctly", async () => {
    const inputSample = new PathInput({
      inputPath: path.join(financialDocumentPath, "default_sample.jpg")
    });
    await inputSample.init();

    const response = await loadV2Split(
      path.join(splitPath, "split_single.json")
    );

    const extractedSplits = await response.extractFromFile(inputSample);

    assert.strictEqual(extractedSplits.length, 1);

    assert.strictEqual(extractedSplits[0].pageCount, 1);

    const count0 = await getPageCount(extractedSplits[0].buffer);
    assert.strictEqual(count0, 1);
  });

  await it("should process multi page receipt split correctly", async () => {
    const inputSample = new PathInput({
      inputPath: path.join(splitPath, "invoice_5p.pdf")
    });
    await inputSample.init();

    const response = await loadV2Split(
      path.join(splitPath, "split_multiple.json")
    );

    const extractedSplits = await response.extractFromFile(inputSample);

    assert.strictEqual(extractedSplits.length, 3);

    assert.strictEqual(extractedSplits[0].pageCount, 1);
    const count0 = await getPageCount(extractedSplits[0].buffer);
    assert.strictEqual(count0, 1);

    assert.strictEqual(extractedSplits[1].pageCount, 3);
    const count1 = await getPageCount(extractedSplits[1].buffer);
    assert.strictEqual(count1, 3);

    assert.strictEqual(extractedSplits[2].pageCount, 1);
    const count2 = await getPageCount(extractedSplits[2].buffer);
    assert.strictEqual(count2, 1);
  });
});
