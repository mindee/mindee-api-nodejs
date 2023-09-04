import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { Ocr } from "../../../src/parsing/common/ocr";
import { InvoiceV4 } from "../../../src/product";
import { Document } from "../../../src";

const dataPath = {
  complete: "tests/data/extras/ocr/complete.json",
  docString: "tests/data/extras/ocr/ocr.txt"
};

describe("When getting all lines in an OCR", () => {
  it("should not affect word order", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new Document(InvoiceV4, response.document);
    if (doc.ocr !== undefined) {
      const allWordsStart = doc.ocr.mVisionV1.pages[0].allWords;
      // Trigger a potential change in list order
      doc.ocr.mVisionV1.pages[0].getAllLines();
      const allWordsEnd = doc.ocr.mVisionV1.pages[0].allWords;
      expect(allWordsStart).to.be.equals(allWordsEnd);
    } else {
      throw new Error("No ocr");
    }
  });

  it("should match expected string exactly", async () => {
    const jsonDataComplete = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonDataComplete.toString());
    const ocr = new Ocr(response.document.ocr);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(ocr.toString()).to.be.equals(docString.toString());
  });
});
