import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { ReceiptV5 } from "../../../src/product";
import { Document } from "../../../src";

const dataPath = {
  complete: "tests/data/extras/ocr/complete.json",
  docString: "tests/data/extras/ocr/ocr.txt"
};

describe("When getting all lines in an OCR", () => {
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
    expect(allWordsStart).to.be.equals(allWordsEnd);
  });

  it("should match expected string exactly", async () => {
    const jsonDataComplete = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonDataComplete.toString());
    const doc = new Document(ReceiptV5, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    if (!doc.ocr) {
      throw new Error("No ocr.");
    }
    expect(doc.ocr.toString()).to.be.equals(docString.toString());
  });
});
