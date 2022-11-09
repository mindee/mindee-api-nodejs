import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { dataPath } from "../../../apiPaths";
import { BankCheckV1 } from "../../../../src/documents/us";

describe("US Bank check V1 Object initialization", async () => {
  it.only("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(
      path.resolve(dataPath.bankCheckV1.empty)
    );
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new BankCheckV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.accountNumber.value).to.be.undefined;
    expect(doc.amount.value).to.be.undefined;
    expect(doc.issuanceDate.value).to.be.undefined;
    expect(doc.checkNumber.value).to.be.undefined;
    expect(doc.routingNumber.value).to.be.undefined;
  });

  it.only("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.bankCheckV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new BankCheckV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(
      path.join(dataPath.bankCheckV1.docString)
    );
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
