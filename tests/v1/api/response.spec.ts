import { promises as fs } from "fs";
import * as path from "path";
import assert from "node:assert/strict";
import { PredictResponse } from "@/v1/index.js";
import { InvoiceV4, ReceiptV5 } from "@/v1/product/index.js";
import { V1_PRODUCT_PATH } from "../../index.js";

const dataPath = {
  receiptV5: path.join(V1_PRODUCT_PATH, "expense_receipts/response_v5/complete.json"),
  invoiceV4: path.join(V1_PRODUCT_PATH, "invoices/response_v4/complete.json"),
  customV1: path.join(V1_PRODUCT_PATH, "custom/response_v1/complete.json"),
};

describe("MindeeV1 - Synchronous API predict response", () => {
  it("should build a Receipt response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receiptV5));
    const httpResponse = JSON.parse(jsonData.toString());
    const response = new PredictResponse(ReceiptV5, httpResponse);
    assert.ok(response.document.inference.prediction);
    assert.strictEqual(response.document.inference.pages.length, 1);
    assert.strictEqual(response.document.nPages, 1);
    response.document.inference.pages.forEach((page, idx) => {
      assert.strictEqual(page.id, idx);
      assert.ok(page.toString());
    });
  });

  it("should build an Invoice response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoiceV4));
    const httpResponse =  JSON.parse(jsonData.toString());
    const response = new PredictResponse(InvoiceV4, httpResponse);
    assert.ok(response.document.inference.prediction);
    assert.strictEqual(response.document.inference.pages.length, 1);
    assert.strictEqual(response.document.nPages, 1);
    response.document.inference.pages.forEach((page, idx) => {
      assert.strictEqual(page.id, idx);
      assert.ok(page.toString());
    });
  });

});
