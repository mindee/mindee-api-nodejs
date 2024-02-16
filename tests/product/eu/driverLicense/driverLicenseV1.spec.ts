import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: "tests/data/products/eu_driver_license/response_v1/complete.json",
  empty: "tests/data/products/eu_driver_license/response_v1/empty.json",
  docString: "tests/data/products/eu_driver_license/response_v1/summary_full.rst",
  page0String: "tests/data/products/eu_driver_license/response_v1/summary_page0.rst",
};

describe("DriverLicenseV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.eu.DriverLicenseV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.countryCode.value).to.be.undefined;
    expect(docPrediction.documentId.value).to.be.undefined;
    expect(docPrediction.category.value).to.be.undefined;
    expect(docPrediction.lastName.value).to.be.undefined;
    expect(docPrediction.firstName.value).to.be.undefined;
    expect(docPrediction.dateOfBirth.value).to.be.undefined;
    expect(docPrediction.placeOfBirth.value).to.be.undefined;
    expect(docPrediction.expiryDate.value).to.be.undefined;
    expect(docPrediction.issueDate.value).to.be.undefined;
    expect(docPrediction.issueAuthority.value).to.be.undefined;
    expect(docPrediction.mrz.value).to.be.undefined;
    expect(docPrediction.address.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.eu.DriverLicenseV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.eu.DriverLicenseV1, response.document);
    const page0 = doc.inference.pages[0];
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(page0.toString()).to.be.equals(docString.toString());
  });
});
