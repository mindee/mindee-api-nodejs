import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../index.js";
import assert from "node:assert/strict";
import * as mindee from "@/index.js";

const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "invoices/response_v4/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "invoices/response_v4/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "invoices/response_v4/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "invoices/response_v4/summary_page0.rst"),
};

describe("MindeeV1 - InvoiceV4 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.InvoiceV4, response.document);
    const docPrediction = doc.inference.prediction;
    assert.strictEqual(docPrediction.locale.value, undefined);
    assert.strictEqual(docPrediction.invoiceNumber.value, undefined);
    assert.strictEqual(docPrediction.poNumber.value, undefined);
    assert.strictEqual(docPrediction.referenceNumbers.length, 0);
    assert.strictEqual(docPrediction.date.value, undefined);
    assert.strictEqual(docPrediction.dueDate.value, undefined);
    assert.strictEqual(docPrediction.paymentDate.value, undefined);
    assert.strictEqual(docPrediction.totalNet.value, undefined);
    assert.strictEqual(docPrediction.totalAmount.value, undefined);
    assert.strictEqual(docPrediction.totalTax.value, undefined);
    assert.strictEqual(docPrediction.taxes.length, 0);
    assert.strictEqual(docPrediction.supplierPaymentDetails.length, 0);
    assert.strictEqual(docPrediction.supplierName.value, undefined);
    assert.strictEqual(docPrediction.supplierCompanyRegistrations.length, 0);
    assert.strictEqual(docPrediction.supplierAddress.value, undefined);
    assert.strictEqual(docPrediction.supplierPhoneNumber.value, undefined);
    assert.strictEqual(docPrediction.supplierWebsite.value, undefined);
    assert.strictEqual(docPrediction.supplierEmail.value, undefined);
    assert.strictEqual(docPrediction.customerName.value, undefined);
    assert.strictEqual(docPrediction.customerCompanyRegistrations.length, 0);
    assert.strictEqual(docPrediction.customerAddress.value, undefined);
    assert.strictEqual(docPrediction.customerId.value, undefined);
    assert.strictEqual(docPrediction.shippingAddress.value, undefined);
    assert.strictEqual(docPrediction.billingAddress.value, undefined);
    assert.strictEqual(docPrediction.lineItems.length, 0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.InvoiceV4, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    assert.strictEqual(doc.toString(), docString.toString());
  });
});
