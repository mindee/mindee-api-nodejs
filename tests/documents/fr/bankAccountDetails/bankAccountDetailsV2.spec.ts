import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";

import * as mindee from "../../../../src";


const dataPath = {
  complete: "tests/data/fr/bank_account_details/response_v2/complete.json",
  empty: "tests/data/fr/bank_account_details/response_v2/empty.json",
  docString: "tests/data/fr/bank_account_details/response_v2/doc_to_string.rst",
  page0String: "tests/data/fr/bank_account_details/response_v2/page0_to_string.rst",
};

describe("BankAccountDetailsV2 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.fr.BankAccountDetailsV2({
      prediction: response.document.inference.prediction,
    });
    expect(doc.accountHoldersNames.value).to.be.undefined;
    expect(doc.bban.bbanBankCode).to.be.null;
    expect(doc.bban.bbanBranchCode).to.be.null;
    expect(doc.bban.bbanKey).to.be.null;
    expect(doc.bban.bbanNumber).to.be.null;
    expect(doc.iban.value).to.be.undefined;
    expect(doc.swiftCode.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new mindee.fr.BankAccountDetailsV2({
      prediction: prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new mindee.fr.BankAccountDetailsV2({
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
