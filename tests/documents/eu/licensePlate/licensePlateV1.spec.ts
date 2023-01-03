import { promises as fs } from "fs";
import * as path from "path";
import { eu } from "../../../../src";
import { expect } from "chai";
import { dataPath } from "../../../apiPaths";
import { TextField } from "../../../../src/fields";

describe("EU License plate V1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(
      path.resolve(dataPath.licensePlateV1.empty)
    );
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new eu.LicensePlateV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.licensePlates[0].value).to.be.undefined;
    expect((doc.licensePlates as TextField[]).length).to.be.equal(2);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.licensePlateV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new eu.LicensePlateV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(
      path.join(dataPath.licensePlateV1.docString)
    );
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
