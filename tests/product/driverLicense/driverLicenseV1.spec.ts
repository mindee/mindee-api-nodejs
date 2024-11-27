import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";


const dataPath = {
  complete: "tests/data/products/driver_license/response_v1/complete.json",
  empty: "tests/data/products/driver_license/response_v1/empty.json",
  docString: "tests/data/products/driver_license/response_v1/summary_full.rst",
  page0String: "tests/data/products/driver_license/response_v1/summary_page0.rst",
};

describe("DriverLicenseV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.DriverLicenseV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.countryCode.value).to.be.undefined;
    expect(docPrediction.state.value).to.be.undefined;
    expect(docPrediction.id.value).to.be.undefined;
    expect(docPrediction.category.value).to.be.undefined;
    expect(docPrediction.lastName.value).to.be.undefined;
    expect(docPrediction.firstName.value).to.be.undefined;
    expect(docPrediction.dateOfBirth.value).to.be.undefined;
    expect(docPrediction.placeOfBirth.value).to.be.undefined;
    expect(docPrediction.expiryDate.value).to.be.undefined;
    expect(docPrediction.issuedDate.value).to.be.undefined;
    expect(docPrediction.issuingAuthority.value).to.be.undefined;
    expect(docPrediction.mrz.value).to.be.undefined;
    expect(docPrediction.ddNumber.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.DriverLicenseV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
