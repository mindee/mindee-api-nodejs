import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";


const dataPath = {
  complete: "tests/data/products/business_card/response_v1/complete.json",
  empty: "tests/data/products/business_card/response_v1/empty.json",
  docString: "tests/data/products/business_card/response_v1/summary_full.rst",
  page0String: "tests/data/products/business_card/response_v1/summary_page0.rst",
};

describe("BusinessCardV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.BusinessCardV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.firstname.value).to.be.undefined;
    expect(docPrediction.lastname.value).to.be.undefined;
    expect(docPrediction.jobTitle.value).to.be.undefined;
    expect(docPrediction.company.value).to.be.undefined;
    expect(docPrediction.email.value).to.be.undefined;
    expect(docPrediction.phoneNumber.value).to.be.undefined;
    expect(docPrediction.mobileNumber.value).to.be.undefined;
    expect(docPrediction.faxNumber.value).to.be.undefined;
    expect(docPrediction.address.value).to.be.undefined;
    expect(docPrediction.website.value).to.be.undefined;
    expect(docPrediction.socialMedia.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.BusinessCardV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
