import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";

const dataPath = {
  complete: "tests/data/cropper/response_v1/complete.json",
  empty: "tests/data/cropper/response_v1/empty.json",
  docString: "tests/data/cropper/response_v1/doc_to_string.txt",
  page0String: "tests/data/cropper/response_v1/page0_to_string.txt",
};

describe("Cropper Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.CropperV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.cropping.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new mindee.CropperV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.cropping.length).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
    expect(doc.checkAll()).to.be.true;
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new mindee.CropperV1({
      prediction: pageData.prediction,
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    console.log(doc.cropping.toString());
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(doc.orientation?.value).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
    expect(doc.cropping.length).to.be.equals(2);
    expect(doc.checkAll()).to.be.true;
  });
});
