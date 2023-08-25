import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: "tests/data/products/idcard_fr/response_v1/complete.json",
  empty: "tests/data/products/idcard_fr/response_v1/empty.json",
  docString: "tests/data/products/idcard_fr/response_v1/summary_full.rst",
  page0String: "tests/data/products/idcard_fr/response_v1/summary_page0.rst",
};

describe("IdCardV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.fr.IdCardV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.idNumber.value).to.be.undefined;
    expect(docPrediction.givenNames.length).to.be.equals(0);
    expect(docPrediction.surname.value).to.be.undefined;
    expect(docPrediction.birthDate.value).to.be.undefined;
    expect(docPrediction.birthPlace.value).to.be.undefined;
    expect(docPrediction.expiryDate.value).to.be.undefined;
    expect(docPrediction.authority.value).to.be.undefined;
    expect(docPrediction.gender.value).to.be.undefined;
    expect(docPrediction.mrz1.value).to.be.undefined;
    expect(docPrediction.mrz2.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.fr.IdCardV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.fr.IdCardV1, response.document);
    const page0 = doc.inference.pages[0];
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(page0.orientation?.value).to.be.equals(0);
    expect(page0.toString()).to.be.equals(docString.toString());
  });
});
