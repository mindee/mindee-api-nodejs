import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../../index";
import { expect } from "chai";
import * as mindee from "../../../../../src";


const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "us_healthcare_cards/response_v1/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "us_healthcare_cards/response_v1/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "us_healthcare_cards/response_v1/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "us_healthcare_cards/response_v1/summary_page0.rst"),
};

describe("MindeeV1 - HealthcareCardV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.HealthcareCardV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.companyName.value).to.be.undefined;
    expect(docPrediction.planName.value).to.be.undefined;
    expect(docPrediction.memberName.value).to.be.undefined;
    expect(docPrediction.memberId.value).to.be.undefined;
    expect(docPrediction.issuer80840.value).to.be.undefined;
    expect(docPrediction.dependents.length).to.be.equals(0);
    expect(docPrediction.groupNumber.value).to.be.undefined;
    expect(docPrediction.payerId.value).to.be.undefined;
    expect(docPrediction.rxBin.value).to.be.undefined;
    expect(docPrediction.rxId.value).to.be.undefined;
    expect(docPrediction.rxGrp.value).to.be.undefined;
    expect(docPrediction.rxPcn.value).to.be.undefined;
    expect(docPrediction.copays.length).to.be.equals(0);
    expect(docPrediction.enrollmentDate.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.HealthcareCardV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
