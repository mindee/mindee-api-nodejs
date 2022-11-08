import { promises as fs } from "fs";
import * as path from "path";
import { fr } from "../../../../src";
import { expect } from "chai";
import { dataPath } from "../../../apiPaths";

describe("FR Id card V1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(
      path.resolve(dataPath.idCardV1.empty)
    );
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new fr.IdCardV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.birthDate.value).to.be.undefined;
    expect(doc.surname.value).to.be.undefined;
    expect(doc.expiryDate.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.idCardV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new fr.IdCardV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(
      path.join(dataPath.idCardV1.docString)
    );
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.idCardV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new fr.IdCardV1({
      prediction: pageData.prediction,
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    const docString = await fs.readFile(
      path.join(dataPath.idCardV1.page0String)
    );
    expect(doc.orientation?.value).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
