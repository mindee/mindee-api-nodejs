import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../index.js";
import { expect } from "chai";
import * as mindee from "@/index.js";


const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "driver_license/response_v1/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "driver_license/response_v1/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "driver_license/response_v1/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "driver_license/response_v1/summary_page0.rst"),
};

describe("MindeeV1 - DriverLicenseV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.DriverLicenseV1, response.document);
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
    const doc = new mindee.v1.Document(mindee.v1.product.DriverLicenseV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
