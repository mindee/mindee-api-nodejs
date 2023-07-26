import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";
import { LicensePlateV1 } from "../../../../src/product/eu";

const dataPath = {
  complete: "tests/data/eu/license_plate/response_v1/complete.json",
  empty: "tests/data/eu/license_plate/response_v1/empty.json",
  docString: "tests/data/eu/license_plate/response_v1/summary_full.rst",
  page0String: "tests/data/eu/license_plate/response_v1/summary_page0.rst",
};

describe("LicensePlateV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new LicensePlateV1(response.document.inference);
    expect(doc.prediction.licensePlates.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const docPrediction = response.document;
    const doc = new mindee.Document(LicensePlateV1, docPrediction);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new LicensePlateV1(response.document.inference);
    const pageString = await fs.readFile(path.join(dataPath.page0String));
    const page0 = doc.pages[0];
    expect(page0.orientation?.value).to.be.equals(0);
    expect(page0.toString()).to.be.equals(pageString.toString());
  });
});
