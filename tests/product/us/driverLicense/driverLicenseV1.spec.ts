import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: "tests/data/us/driver_license/response_v1/complete.json",
  empty: "tests/data/us/driver_license/response_v1/empty.json",
  docString: "tests/data/us/driver_license/response_v1/summary_full.rst",
  page0String: "tests/data/us/driver_license/response_v1/summary_page0.rst",
};

describe("DriverLicenseV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.DriverLicenseV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.state.value).to.be.undefined;
    expect(docPrediction.driverLicenseId.value).to.be.undefined;
    expect(docPrediction.expiryDate.value).to.be.undefined;
    expect(docPrediction.issuedDate.value).to.be.undefined;
    expect(docPrediction.lastName.value).to.be.undefined;
    expect(docPrediction.firstName.value).to.be.undefined;
    expect(docPrediction.address.value).to.be.undefined;
    expect(docPrediction.dateOfBirth.value).to.be.undefined;
    expect(docPrediction.restrictions.value).to.be.undefined;
    expect(docPrediction.endorsements.value).to.be.undefined;
    expect(docPrediction.dlClass.value).to.be.undefined;
    expect(docPrediction.sex.value).to.be.undefined;
    expect(docPrediction.height.value).to.be.undefined;
    expect(docPrediction.weight.value).to.be.undefined;
    expect(docPrediction.hairColor.value).to.be.undefined;
    expect(docPrediction.eyeColor.value).to.be.undefined;
    expect(docPrediction.ddNumber.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.DriverLicenseV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.DriverLicenseV1, response.document);
    const page0 = doc.inference.pages[0];
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(page0.orientation?.value).to.be.equals(0);
    expect(page0.toString()).to.be.equals(docString.toString());
  });
});
