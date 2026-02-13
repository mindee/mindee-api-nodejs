import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../../index.js";
import { expect } from "chai";
import * as mindee from "@/index.js";


const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "bank_account_details/response_v2/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "bank_account_details/response_v2/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "bank_account_details/response_v2/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "bank_account_details/response_v2/summary_page0.rst"),
};

describe("MindeeV1 - BankAccountDetailsV2 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.fr.BankAccountDetailsV2, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.accountHoldersNames.value).to.be.undefined;
    expect(docPrediction.bban.bbanBankCode).to.be.null;
    expect(docPrediction.bban.bbanBranchCode).to.be.null;
    expect(docPrediction.bban.bbanKey).to.be.null;
    expect(docPrediction.bban.bbanNumber).to.be.null;
    expect(docPrediction.iban.value).to.be.undefined;
    expect(docPrediction.swiftCode.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.fr.BankAccountDetailsV2, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
