import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";


const dataPath = {
  complete: "tests/data/products/proof_of_address/response_v1/complete.json",
  empty: "tests/data/products/proof_of_address/response_v1/empty.json",
  docString: "tests/data/products/proof_of_address/response_v1/summary_full.rst",
  page0String: "tests/data/products/proof_of_address/response_v1/summary_page0.rst",
};

describe("ProofOfAddressV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.ProofOfAddressV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.locale.value).to.be.undefined;
    expect(docPrediction.issuerName.value).to.be.undefined;
    expect(docPrediction.issuerCompanyRegistration.length).to.be.equals(0);
    expect(docPrediction.issuerAddress.value).to.be.undefined;
    expect(docPrediction.recipientName.value).to.be.undefined;
    expect(docPrediction.recipientCompanyRegistration.length).to.be.equals(0);
    expect(docPrediction.recipientAddress.value).to.be.undefined;
    expect(docPrediction.dates.length).to.be.equals(0);
    expect(docPrediction.date.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.ProofOfAddressV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
