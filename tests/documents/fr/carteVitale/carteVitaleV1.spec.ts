import { promises as fs } from "fs";
import * as path from "path";
import { fr } from "../../../../src";
import { expect } from "chai";
import { dataPath } from "../../../apiPaths";

describe("FR Carte Vitale V1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(
      path.resolve(dataPath.carteVitaleV1.empty)
    );
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new fr.CarteVitaleV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.socialSecurity.value).to.be.undefined;
    expect(doc.surname.value).to.be.undefined;
    expect(doc.issuanceDate.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.carteVitaleV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new fr.CarteVitaleV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(
      path.join(dataPath.carteVitaleV1.docString)
    );
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
