import { promises as fs } from "fs";
import * as path from "path";
import { PassportV1 } from "../../../src/documents";
import { expect } from "chai";
import { dataPath } from "../../apiPaths";

describe("Passport Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.passportV1.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new PassportV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.birthDate.value).to.be.undefined;
    expect(doc.isExpired()).to.be.true;
    expect(doc.surname.value).to.be.undefined;
    expect(doc.issuanceDate.value).to.be.undefined;
    expect(doc.expiryDate.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.passportV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new PassportV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.passportV1.docString));
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
    const jsonData = await fs.readFile(
      path.resolve(dataPath.passportV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new PassportV1({
      prediction: pageData.prediction,
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    const docString = await fs.readFile(
      path.join(dataPath.passportV1.page0String)
    );
    expect(doc.orientation?.value).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
    expect(doc.checkAll()).to.be.false;
  });
});
