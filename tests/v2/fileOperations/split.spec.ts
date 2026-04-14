import { PathInput } from "@/index.js";
import { ExtractedPdf } from "@/pdf/extractedPdf.js";
import { extractSplits } from "@/v2/fileOperations/split.js";
import { SplitFiles } from "@/v2/fileOperations/splitFiles.js";

import { LocalResponse } from "@/v2/parsing/index.js";
import { SplitResponse } from "@/v2/product/split/splitResponse.js";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "path";
import { BufferInput } from "../../../src/index.js";
import { V2_PRODUCT_PATH } from "../../index.js";

const splitPath = path.join(V2_PRODUCT_PATH, "split");
const financialDocumentPath = path.join(V2_PRODUCT_PATH, "extraction", "financial_document");

async function loadV2Split(resourcePath: string): Promise<SplitResponse> {
  const localResponse = new LocalResponse(resourcePath);
  return localResponse.deserializeResponse(SplitResponse);
}

describe("MindeeV2 - Product - SplitResponse #OptionalDepsRequired", async () => {

  await it("should process single page split correctly", async () => {
    const inputSample = new PathInput({
      inputPath: path.join(financialDocumentPath, "default_sample.jpg")
    });

    const response = await loadV2Split(
      path.join(splitPath, "split_single.json")
    );

    const extractedSplits = await response.extractFromFile(inputSample);

    assert.strictEqual(extractedSplits.length, 1);

    assert.strictEqual(extractedSplits[0].pageCount, 1);

    const inputBuffer0 = new BufferInput({ buffer: extractedSplits[0].buffer, filename: "test.pdf" });
    const count0 = await inputBuffer0.getPageCount();
    assert.strictEqual(count0, 1);
  });

  await it("should process multi page receipt split correctly", async () => {
    const inputSample = new PathInput({
      inputPath: path.join(splitPath, "invoice_5p.pdf")
    });

    const response = await loadV2Split(
      path.join(splitPath, "split_multiple.json")
    );

    const extractedSplits = await response.extractFromFile(inputSample);

    assert.strictEqual(extractedSplits.length, 3);

    assert.strictEqual(extractedSplits[0].pageCount, 1);
    const bufferInput0 = extractedSplits[0].asSource();
    const count0 = await bufferInput0.getPageCount();
    assert.strictEqual(count0, 1);

    const bufferInput1 = extractedSplits[0].asSource();
    const count1 = await bufferInput1.getPageCount();
    assert.strictEqual(extractedSplits[1].pageCount, 3);
    assert.strictEqual(count1, 3);

    assert.strictEqual(extractedSplits[2].pageCount, 1);
    const bufferInput2 = extractedSplits[2].asSource();
    const count2 = await bufferInput2.getPageCount();
    assert.strictEqual(count2, 1);
    const localExtract: ExtractedPdf = await response.inference.result.splits[0].extractFromFile(inputSample);
    assert.ok(extractedSplits[0].buffer.equals(localExtract.buffer));
  });

  await it("extracts a file as itself if the split count is its own length", async () => {
    const inputSample = new PathInput({
      inputPath: path.join(splitPath, "invoice_5p.pdf")
    });
    const splitFiles: SplitFiles = await extractSplits(inputSample, [[0, 1, 2, 3, 4]]);
    assert(splitFiles.length === 1);
    assert(splitFiles[0].pageCount === 5);
    assert(splitFiles[0].buffer === inputSample.fileObject);
  });
});
