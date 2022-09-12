import { promises as fs } from "fs";
import * as path from "path";
import { Cropper } from "../../src/documents";
import { expect } from "chai";
import { dataPath } from "../apiPaths";

describe("Cropper Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.cropperV1.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new Cropper({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.cropping.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.cropperV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new Cropper({
      prediction: prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.cropperV1.docString));
    expect(doc.cropping.length).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
    expect(doc.checkAll()).to.be.true;
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.cropperV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new Cropper({
      prediction: pageData.prediction,
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    console.log(doc.cropping.toString())
    const docString = await fs.readFile(
      path.join(dataPath.cropperV1.page0String)
    );
    expect(doc.orientation?.value).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
    expect(doc.cropping.length).to.be.equals(2);
    expect(doc.checkAll()).to.be.true;
  });
});
