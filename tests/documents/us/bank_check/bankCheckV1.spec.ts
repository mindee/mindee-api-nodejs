import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";

const dataPath = {
  complete: "tests/data/us/bank_check/response_v1/complete.json",
  empty: "tests/data/us/bank_check/response_v1/empty.json",
  docString: "tests/data/us/bank_check/response_v1/doc_to_string.txt",
};

describe("US Bank check V1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.us.BankCheckV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.accountNumber.value).to.be.undefined;
    expect(doc.amount.value).to.be.undefined;
    expect(doc.issuanceDate.value).to.be.undefined;
    expect(doc.checkNumber.value).to.be.undefined;
    expect(doc.routingNumber.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new mindee.us.BankCheckV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
