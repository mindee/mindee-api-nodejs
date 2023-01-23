import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { dataPath } from "../../apiPaths";
import { ProofOfAddressV1 } from "../../../src/documents";

describe("Proof of Address V1 Object initialization", async () => {
  it.only("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.proofOfAddressV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new ProofOfAddressV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(
      path.join(dataPath.proofOfAddressV1.docString)
    );
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
