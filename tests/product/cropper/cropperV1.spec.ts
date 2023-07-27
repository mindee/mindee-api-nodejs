import { promises as fs } from "fs";
import * as path from "path";
import * as mindee from "../../../src";
import { CropperV1 } from "../../../src/product";
import { expect } from "chai";

const dataPath = {
  complete: "tests/data/cropper/response_v1/complete.json",
  empty: "tests/data/cropper/response_v1/empty.json",
  docString: "tests/data/cropper/response_v1/summary_full.rst",
  page0String: "tests/data/cropper/response_v1/summary_page0.rst",
};

describe("Cropper Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new CropperV1(response.document.inference);
    expect(doc.prediction.cropping.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const docPrediction = response.document;
    const doc = new mindee.Document(CropperV1, docPrediction);
    const docString = await fs.readFile(path.join(dataPath.docString));
    const inference = doc.inference.prediction;
    expect(inference.cropping.length).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new CropperV1(response.document.inference);
    const page0 = doc.pages[0];
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(page0.orientation?.value).to.be.equals(0);
    expect(page0.toString()).to.be.equals(docString.toString());
    expect(page0.prediction.cropping.length).to.be.equals(2);
  });
});
