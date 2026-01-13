import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../../index.js";
import { expect } from "chai";
import * as mindee from "@/index.js";


const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "ind_passport/response_v1/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "ind_passport/response_v1/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "ind_passport/response_v1/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "ind_passport/response_v1/summary_page0.rst"),
};

describe("MindeeV1 - IndianPassportV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.ind.IndianPassportV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.country.value).to.be.undefined;
    expect(docPrediction.idNumber.value).to.be.undefined;
    expect(docPrediction.givenNames.value).to.be.undefined;
    expect(docPrediction.surname.value).to.be.undefined;
    expect(docPrediction.birthDate.value).to.be.undefined;
    expect(docPrediction.birthPlace.value).to.be.undefined;
    expect(docPrediction.issuancePlace.value).to.be.undefined;
    expect(docPrediction.issuanceDate.value).to.be.undefined;
    expect(docPrediction.expiryDate.value).to.be.undefined;
    expect(docPrediction.mrz1.value).to.be.undefined;
    expect(docPrediction.mrz2.value).to.be.undefined;
    expect(docPrediction.legalGuardian.value).to.be.undefined;
    expect(docPrediction.nameOfSpouse.value).to.be.undefined;
    expect(docPrediction.nameOfMother.value).to.be.undefined;
    expect(docPrediction.oldPassportDateOfIssue.value).to.be.undefined;
    expect(docPrediction.oldPassportNumber.value).to.be.undefined;
    expect(docPrediction.oldPassportPlaceOfIssue.value).to.be.undefined;
    expect(docPrediction.address1.value).to.be.undefined;
    expect(docPrediction.address2.value).to.be.undefined;
    expect(docPrediction.address3.value).to.be.undefined;
    expect(docPrediction.fileNumber.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.ind.IndianPassportV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
