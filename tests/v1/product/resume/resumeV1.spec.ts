import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../index.js";
import { expect } from "chai";
import * as mindee from "@/index.js";


const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "resume/response_v1/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "resume/response_v1/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "resume/response_v1/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "resume/response_v1/summary_page0.rst"),
};

describe("MindeeV1 - ResumeV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.ResumeV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.documentLanguage.value).to.be.undefined;
    expect(docPrediction.givenNames.length).to.be.equals(0);
    expect(docPrediction.surnames.length).to.be.equals(0);
    expect(docPrediction.nationality.value).to.be.undefined;
    expect(docPrediction.emailAddress.value).to.be.undefined;
    expect(docPrediction.phoneNumber.value).to.be.undefined;
    expect(docPrediction.address.value).to.be.undefined;
    expect(docPrediction.socialNetworksUrls.length).to.be.equals(0);
    expect(docPrediction.profession.value).to.be.undefined;
    expect(docPrediction.jobApplied.value).to.be.undefined;
    expect(docPrediction.languages.length).to.be.equals(0);
    expect(docPrediction.hardSkills.length).to.be.equals(0);
    expect(docPrediction.softSkills.length).to.be.equals(0);
    expect(docPrediction.education.length).to.be.equals(0);
    expect(docPrediction.professionalExperiences.length).to.be.equals(0);
    expect(docPrediction.certificates.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.ResumeV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
