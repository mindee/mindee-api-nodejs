import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: "tests/data/products/bank_check/response_v1/complete.json",
  empty: "tests/data/products/bank_check/response_v1/empty.json",
  docString: "tests/data/products/bank_check/response_v1/summary_full.rst",
  page0String: "tests/data/products/bank_check/response_v1/summary_page0.rst",
};

describe("BankCheckV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.BankCheckV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.date.value).to.be.undefined;
    expect(docPrediction.amount.value).to.be.undefined;
    expect(docPrediction.payees.length).to.be.equals(0);
    expect(docPrediction.routingNumber.value).to.be.undefined;
    expect(docPrediction.accountNumber.value).to.be.undefined;
    expect(docPrediction.checkNumber.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.BankCheckV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.BankCheckV1, response.document);
    const page0 = doc.inference.pages[0];
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(page0.toString()).to.be.equals(docString.toString());
  });
});
