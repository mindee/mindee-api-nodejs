import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";

const dataPath = {
  complete: "tests/data/passport/response_v1/complete.json",
  empty: "tests/data/passport/response_v1/empty.json",
  docString: "tests/data/passport/response_v1/doc_to_string.txt",
  page0String: "tests/data/passport/response_v1/page0_to_string.txt",
};

describe("Passport Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.PassportV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.birthDate.value).to.be.undefined;
    expect(doc.isExpired()).to.be.true;
    expect(doc.surname.value).to.be.undefined;
    expect(doc.issuanceDate.value).to.be.undefined;
    expect(doc.expiryDate.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new mindee.PassportV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
    expect(doc.isExpired()).to.be.false;

    expect(doc.checklist["mrzValid"]).to.be.true;
    expect(doc.checklist["mrzValidBirthDate"]).to.be.true;
    expect(doc.checklist["mrzValidExpiryDate"]).to.be.false;
    expect(doc.checklist["mrzValidIdNumber"]).to.be.true;
    expect(doc.checklist["mrzValidSurname"]).to.be.true;
    expect(doc.checklist["mrzValidCountry"]).to.be.true;
    expect(doc.checkAll()).to.be.false;
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new mindee.PassportV1({
      prediction: pageData.prediction,
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(doc.orientation?.value).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
    expect(doc.checkAll()).to.be.false;
  });
});
