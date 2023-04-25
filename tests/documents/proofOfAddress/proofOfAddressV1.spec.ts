import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";

const dataPath = {
  complete: "tests/data/proof_of_address/response_v1/complete.json",
  empty: "tests/data/proof_of_address/response_v1/empty.json",
  docString: "tests/data/proof_of_address/response_v1/doc_to_string.txt",
  page0String: "tests/data/proof_of_address/response_v1/page0_to_string.txt",
};

describe("ProofOfAddressV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.ProofOfAddressV1({
      prediction: response.document.inference.prediction,
    });
    expect(doc.locale.value).to.be.undefined;
    expect(doc.issuerName.value).to.be.undefined;
    expect(doc.issuerCompanyRegistration.length).to.be.equals(0);
    expect(doc.issuerAddress.value).to.be.undefined;
    expect(doc.recipientName.value).to.be.undefined;
    expect(doc.recipientCompanyRegistration.length).to.be.equals(0);
    expect(doc.recipientAddress.value).to.be.undefined;
    expect(doc.dates.length).to.be.equals(0);
    expect(doc.date.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new mindee.ProofOfAddressV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new mindee.ProofOfAddressV1({
      prediction: pageData.prediction,
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(doc.orientation?.value).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
