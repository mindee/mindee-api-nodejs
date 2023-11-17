import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: "tests/data/products/us_w9/response_v1/complete.json",
  empty: "tests/data/products/us_w9/response_v1/empty.json",
  docString: "tests/data/products/us_w9/response_v1/summary_full.rst",
  page0String: "tests/data/products/us_w9/response_v1/summary_page0.rst",
};

describe("W9V1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.W9V1, response.document);
    const pagePrediction = doc.inference.pages[0].prediction;
    expect(pagePrediction.name.value).to.be.undefined;
    expect(pagePrediction.ssn.value).to.be.undefined;
    expect(pagePrediction.address.value).to.be.undefined;
    expect(pagePrediction.cityStateZip.value).to.be.undefined;
    expect(pagePrediction.businessName.value).to.be.undefined;
    expect(pagePrediction.ein.value).to.be.undefined;
    expect(pagePrediction.taxClassification.value).to.be.undefined;
    expect(pagePrediction.taxClassificationOtherDetails.value).to.be.undefined;
    expect(pagePrediction.w9RevisionDate.value).to.be.undefined;
    expect(pagePrediction.signaturePosition.polygon.length).to.be.equals(0);
    expect(pagePrediction.signatureDatePosition.polygon.length).to.be.equals(0);
    expect(pagePrediction.taxClassificationLlc.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.W9V1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.W9V1, response.document);
    const page0 = doc.inference.pages[0];
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(page0.toString()).to.be.equals(docString.toString());
  });
});
