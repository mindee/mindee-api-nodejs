import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../index";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "international_id/response_v2/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "international_id/response_v2/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "international_id/response_v2/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "international_id/response_v2/summary_page0.rst"),
};

describe("MindeeV1 - InternationalIdV2 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.InternationalIdV2, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.documentNumber.value).to.be.undefined;
    expect(docPrediction.surnames.length).to.be.equals(0);
    expect(docPrediction.givenNames.length).to.be.equals(0);
    expect(docPrediction.sex.value).to.be.undefined;
    expect(docPrediction.birthDate.value).to.be.undefined;
    expect(docPrediction.birthPlace.value).to.be.undefined;
    expect(docPrediction.nationality.value).to.be.undefined;
    expect(docPrediction.personalNumber.value).to.be.undefined;
    expect(docPrediction.countryOfIssue.value).to.be.undefined;
    expect(docPrediction.stateOfIssue.value).to.be.undefined;
    expect(docPrediction.issueDate.value).to.be.undefined;
    expect(docPrediction.expiryDate.value).to.be.undefined;
    expect(docPrediction.address.value).to.be.undefined;
    expect(docPrediction.mrzLine1.value).to.be.undefined;
    expect(docPrediction.mrzLine2.value).to.be.undefined;
    expect(docPrediction.mrzLine3.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.InternationalIdV2, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
