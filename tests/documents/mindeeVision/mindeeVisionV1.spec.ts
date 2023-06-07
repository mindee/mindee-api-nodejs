import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";

const dataPath = {
  complete: "tests/data/mindee_vision/response_v1/complete.json",
  page0String: "tests/data/mindee_vision/response_v1/page0_to_string.txt",
};

describe("MindeeVisionV1 Object initialization", async () => {
  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new mindee.product.MindeeVisionV1({
      prediction: pageData.prediction,
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(doc.allWords.length).to.be.equals(61);
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
