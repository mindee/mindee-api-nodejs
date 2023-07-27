import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { Ocr } from "../../../src/parsing/common/ocr/ocr";

const dataPath = {
  complete: "tests/data/ocr/complete_with_ocr.json",
  docString: "tests/data/ocr/ocr.txt"
};


describe("When getting all lines in an ocr", () => {
  it("should not affect word order", async () => {
    const jsonDataComplete = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonDataComplete.toString());
    const ocr = new Ocr(response.document.ocr);
    const allWordsStart = ocr.mVisionV1.pages[0].allWords;
    // Trigger a potential change in list order
    ocr.mVisionV1.pages[0].getAllLines();
    const allWordsEnd = ocr.mVisionV1.pages[0].allWords;
    expect(allWordsStart).to.be.equals(allWordsEnd);
  });

  it("should match expected string exactly", async () => {
    const jsonDataComplete = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonDataComplete.toString());
    const ocr = new Ocr(response.document.ocr);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(ocr.toString()).to.be.equals(docString.toString());
  });
});
