import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: "tests/data/products/us_healthcare_cards/response_v1/complete.json",
  empty: "tests/data/products/us_healthcare_cards/response_v1/empty.json",
  docString: "tests/data/products/us_healthcare_cards/response_v1/summary_full.rst",
  page0String: "tests/data/products/us_healthcare_cards/response_v1/summary_page0.rst",
};

describe("HealthcareCardV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.HealthcareCardV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.companyName.value).to.be.undefined;
    expect(docPrediction.memberName.value).to.be.undefined;
    expect(docPrediction.memberId.value).to.be.undefined;
    expect(docPrediction.issuer80840.value).to.be.undefined;
    expect(docPrediction.dependents.length).to.be.equals(0);
    expect(docPrediction.groupNumber.value).to.be.undefined;
    expect(docPrediction.payerId.value).to.be.undefined;
    expect(docPrediction.rxBin.value).to.be.undefined;
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
