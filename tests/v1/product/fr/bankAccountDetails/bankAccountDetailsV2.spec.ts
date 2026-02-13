import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { promises as fs } from "fs";
import * as mindee from "@/index.js";
import { V1_PRODUCT_PATH } from "../../../../index.js";


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
    assert.strictEqual(docPrediction.accountHoldersNames.value, undefined);
    assert.ok(docPrediction.bban.bbanBankCode === null);
    assert.ok(docPrediction.bban.bbanBranchCode === null);
    assert.ok(docPrediction.bban.bbanKey === null);
    assert.ok(docPrediction.bban.bbanNumber === null);
    assert.strictEqual(docPrediction.iban.value, undefined);
    assert.strictEqual(docPrediction.swiftCode.value, undefined);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.fr.BankAccountDetailsV2, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    assert.strictEqual(doc.toString(), docString.toString());
  });
});
