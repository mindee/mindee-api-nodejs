import { promises as fs } from "fs";
import * as path from "path";
import assert from "node:assert/strict";
import { ReceiptV5 } from "@/v1/product/index.js";
import { Document } from "@/v1/index.js";
import { RESOURCE_PATH } from "../../index.js";

const dataPath = {
  complete: path.join(RESOURCE_PATH, "v1/extras/ocr/complete.json"),
  docString: path.join(RESOURCE_PATH, "v1/extras/ocr/ocr.txt"),
};

describe("MindeeV1 - When getting all lines in an OCR", () => {
  it("should not affect word order", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new Document(ReceiptV5, response.document);
    if (!doc.ocr) {
      throw new Error("No ocr.");
    }
    const allWordsStart = doc.ocr.mVisionV1.pages[0].allWords;
    // Trigger a potential change in list order
    const allWordsEnd = doc.ocr.mVisionV1.pages[0].allWords;
    assert.strictEqual(allWordsStart, allWordsEnd);
  });

  it("should match expected string exactly", async () => {
    const jsonDataComplete = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonDataComplete.toString());
    const doc = new Document(ReceiptV5, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    if (!doc.ocr) {
      throw new Error("No ocr.");
    }
    assert.strictEqual(doc.ocr.toString(), docString.toString());
  });
});
