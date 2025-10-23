import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: "tests/data/products/resume/response_v1/complete.json",
  empty: "tests/data/products/resume/response_v1/empty.json",
  docString: "tests/data/products/resume/response_v1/summary_full.rst",
  page0String: "tests/data/products/resume/response_v1/summary_page0.rst",
};

describe("ResumeV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.ResumeV1, response.document);
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
    const doc = new mindee.Document(mindee.product.ResumeV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
