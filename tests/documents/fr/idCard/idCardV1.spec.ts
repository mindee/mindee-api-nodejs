import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";

const dataPath = {
  complete: "tests/data/fr/id_card/response_v1/complete.json",
  empty: "tests/data/fr/id_card/response_v1/empty.json",
  docString: "tests/data/fr/id_card/response_v1/doc_to_string.txt",
  page0String: "tests/data/fr/id_card/response_v1/page0_to_string.txt",
};

describe("IdCardV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.fr.IdCardV1({
      prediction: response.document.inference.prediction,
    });
    expect(doc.documentSide.value).to.be.undefined;
    expect(doc.idNumber.value).to.be.undefined;
    expect(doc.givenNames.length).to.be.equals(0);
    expect(doc.surname.value).to.be.undefined;
    expect(doc.birthDate.value).to.be.undefined;
    expect(doc.birthPlace.value).to.be.undefined;
    expect(doc.expiryDate.value).to.be.undefined;
    expect(doc.authority.value).to.be.undefined;
    expect(doc.gender.value).to.be.undefined;
    expect(doc.mrz1.value).to.be.undefined;
    expect(doc.mrz2.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new mindee.fr.IdCardV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new mindee.fr.IdCardV1({
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
