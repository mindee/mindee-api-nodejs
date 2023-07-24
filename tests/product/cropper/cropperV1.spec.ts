import { promises as fs } from "fs";
import * as path from "path";
import { CropperV1Document } from "../../../src/product/cropper/cropperV1Document";
import { Page } from "../../../src/parsing/common";
import { CropperV1 } from "../../../src/product";

const dataPath = {
  complete: "tests/data/cropper/response_v1/complete.json",
  empty: "tests/data/cropper/response_v1/empty.json",
  docString: "tests/data/cropper/response_v1/doc_to_string.txt",
  page0String: "tests/data/cropper/response_v1/page0_to_string.txt",
};

// Note: Test for cropper product are pending update on the client lib
describe("Cropper Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new CropperV1(response.document.inference);
    // expect(doc.prediction.cropping.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const inference = response.document.inference;
    const doc = new CropperV1(inference);
    const docString = await fs.readFile(path.join(dataPath.docString));
    // expect(doc.prediction.cropping.length).to.be.equals(0);
    // expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new CropperV1(response.document.inference);
    // Note: page type assertion is necessary here as Typescript loses track of
    // which classes inherit from 'Prediction' otherwise.
    const page0 = doc.pages[0] as Page<CropperV1Document>;
    const docString = await fs.readFile(path.join(dataPath.page0String));
    // expect(page0.orientation?.value).to.be.equals(0);
    // expect(page0.toString()).to.be.equals(docString.toString());
    // expect(page0.prediction.cropping.length).to.be.equals(2);
  });
});
