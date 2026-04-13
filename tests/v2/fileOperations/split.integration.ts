import { after, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import * as fs from "node:fs";

import { Client, PathInput, BufferInput } from "@/index.js";
import { Split } from "@/v2/product/split/index.js";
import { Extraction, ExtractionResponse } from "@/v2/product/extraction/index.js";
import { V2_PRODUCT_PATH } from "../../index.js";
import { SimpleField } from "@/v2/parsing/inference/field/index.js";
import { loadOptionalDependency } from "@/dependency/index.js";
import type * as pdfLibTypes from "@cantoo/pdf-lib";

const OUTPUT_DIR = path.join(__dirname, "output");
let pdfLib: typeof pdfLibTypes | null = null;

async function getPdfLib(): Promise<typeof pdfLibTypes> {
  if (!pdfLib) {
    const pdfLibImport = await loadOptionalDependency<typeof pdfLibTypes>("@cantoo/pdf-lib", "PDF Parsing");
    pdfLib = (pdfLibImport as any).default || pdfLibImport;
  }
  return pdfLib!;
}

async function getPageCount(buffer: Buffer): Promise<number> {
  const isPdf = buffer.subarray(0, 4).toString("ascii") === "%PDF";
  if (isPdf) {
    const lib = await getPdfLib();
    const pdfDoc = await lib.PDFDocument.load(buffer);
    return pdfDoc.getPageCount();
  }
  return 1;
}

function checkFindocReturn(findocResponse: ExtractionResponse) {
  assert.ok(findocResponse.inference.model.id.length > 0);
  const totalAmount = findocResponse.inference.result.fields.get("total_amount") as SimpleField;
  assert.ok(totalAmount !== undefined);
  assert.ok((totalAmount.value as number) > 0);
}

describe("MindeeV2 - Integration - Product - Split #OptionalDepsRequired", { timeout: 120000 }, () => {
  let client: Client;
  let splitModelId: string;
  let findocModelId: string;

  const splitSample = path.join(
    V2_PRODUCT_PATH,
    "split",
    "default_sample.pdf"
  );

  beforeEach(() => {
    const apiKey = process.env["MINDEE_V2_API_KEY"] ?? "";
    splitModelId = process.env["MINDEE_V2_SE_TESTS_SPLIT_MODEL_ID"] ?? "";
    findocModelId = process.env["MINDEE_V2_SE_TESTS_FINDOC_MODEL_ID"] ?? "";

    client = new Client({ apiKey: apiKey, debug: true });
  });

  after(() => {
    const file1 = path.join(OUTPUT_DIR, "split_001.pdf");
    const file2 = path.join(OUTPUT_DIR, "split_002.pdf");
    if (fs.existsSync(file1)) fs.rmSync(file1);
    if (fs.existsSync(file2)) fs.rmSync(file2);
  });

  it("extracts splits from pdf correctly", async () => {
    const splitInput = new PathInput({ inputPath: splitSample });
    await splitInput.init();

    const splitParams = { modelId: splitModelId };

    const response: any = await client.enqueueAndGetResult(
      Split, splitInput, splitParams
    );

    assert.equal(response.inference.file.pageCount, 2);

    const extractedPdfs = await response.extractFromFile(splitInput);

    assert.equal(extractedPdfs.length, 2);
    assert.equal(extractedPdfs[0].filename, "default_sample_page_001-001.pdf");
    assert.equal(extractedPdfs[1].filename, "default_sample_page_002-002.pdf");

    const extractionInput = new BufferInput({
      buffer: extractedPdfs[0].buffer,
      filename: extractedPdfs[0].filename
    });

    const findocParams = { modelId: findocModelId };

    const invoice0 = await client.enqueueAndGetResult(
      Extraction, extractionInput, findocParams
    );

    checkFindocReturn(invoice0 as ExtractionResponse);

    const file1Path = path.join(OUTPUT_DIR, "split_001.pdf");
    const file2Path = path.join(OUTPUT_DIR, "split_002.pdf");

    fs.writeFileSync(file1Path, extractedPdfs[0].buffer);
    fs.writeFileSync(file2Path, extractedPdfs[1].buffer);

    const localBuffer1 = fs.readFileSync(file1Path);
    const pageCount1 = await getPageCount(localBuffer1);
    assert.equal(pageCount1, extractedPdfs[0].pageCount);

    const localBuffer2 = fs.readFileSync(file2Path);
    const pageCount2 = await getPageCount(localBuffer2);
    assert.equal(pageCount2, extractedPdfs[1].pageCount);
  });
});
