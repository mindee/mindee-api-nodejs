import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { promises as fs } from "fs";
import * as mindee from "@/index.js";
import { V1_PRODUCT_PATH } from "../../../index.js";

const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "expense_receipts/response_v5/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "expense_receipts/response_v5/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "expense_receipts/response_v5/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "expense_receipts/response_v5/summary_page0.rst"),
};

describe("MindeeV1 - ReceiptV5 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.ReceiptV5, response.document);
    const docPrediction = doc.inference.prediction;
    assert.strictEqual(docPrediction.locale.value, undefined);
    assert.strictEqual(docPrediction.date.value, undefined);
    assert.strictEqual(docPrediction.time.value, undefined);
    assert.strictEqual(docPrediction.totalAmount.value, undefined);
    assert.strictEqual(docPrediction.totalNet.value, undefined);
    assert.strictEqual(docPrediction.totalTax.value, undefined);
    assert.strictEqual(docPrediction.tip.value, undefined);
    assert.strictEqual(docPrediction.taxes.length, 0);
    assert.strictEqual(docPrediction.supplierName.value, undefined);
    assert.strictEqual(docPrediction.supplierCompanyRegistrations.length, 0);
    assert.strictEqual(docPrediction.supplierAddress.value, undefined);
    assert.strictEqual(docPrediction.supplierPhoneNumber.value, undefined);
    assert.strictEqual(docPrediction.receiptNumber.value, undefined);
    assert.strictEqual(docPrediction.lineItems.length, 0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.ReceiptV5, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    assert.strictEqual(doc.toString(), docString.toString());
  });
});
