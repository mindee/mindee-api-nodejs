import {promises as fs} from "fs";
import path from "path";
import {expect} from "chai";
import {AsyncPredictResponse} from "../../src";
import {InternationalIdV2} from "../../src/product";

const fullTextOcrDir = "tests/data/extras/full_text_ocr";

async function loadDocument() {
  const jsonData = await fs.readFile(path.resolve(fullTextOcrDir, "complete.json"));
  return new AsyncPredictResponse(
    InternationalIdV2, JSON.parse(jsonData.toString())
  ).document?.extras?.fullTextOcr.toString();
}

async function loadPage() {
  const jsonData = await fs.readFile(path.resolve(fullTextOcrDir, "complete.json"));
  return new AsyncPredictResponse(
    InternationalIdV2, JSON.parse(jsonData.toString())
  )?.document?.inference.pages[0]?.extras?.fullTextOcr.toString();
}

describe("Full Text Ocr", async () => {
  it("should load a Full Text OCR prediction at document level", async () => {
    const expectedText = (await fs.readFile(path.resolve(fullTextOcrDir, "full_text_ocr.txt"))).toString();
    const fullTextOcr = await loadDocument();
    expect(fullTextOcr).to.be.equals(expectedText.trim());
  });

  // Not enabled due to the fact that pages without content aren't generated. Left here as a reminder to implement the
  // test in the next major version.
  // TODO: Add test in next major.
  // it("should load a Full Text OCR prediction per page", async () => {
  //   const expectedText = (await fs.readFile(path.resolve(fullTextOcrDir, "full_text_ocr.txt"))).toString();
  //   const fullTextOcr = await loadPage();
  //   expect(fullTextOcr).to.be.equals(expectedText);
  // });
});
