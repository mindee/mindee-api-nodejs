import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { promises as fs } from "fs";
import * as mindee from "@/index.js";
import { V1_PRODUCT_PATH } from "../../../index.js";

const dataPath = {
  receiptComplete: path.join(
    V1_PRODUCT_PATH, "financial_document/response_v1/complete_receipt.json"
  ),
  invoiceComplete: path.join(
    V1_PRODUCT_PATH, "financial_document/response_v1/complete_invoice.json"
  ),
  empty: path.join(
    V1_PRODUCT_PATH, "financial_document/response_v1/empty.json"
  ),
  invoiceDocString: path.join(
    V1_PRODUCT_PATH, "financial_document/response_v1/summary_full_invoice.rst"
  ),
  receiptDocString: path.join(
    V1_PRODUCT_PATH, "financial_document/response_v1/summary_full_receipt.rst"
  ),
  page0InvoiceString: path.join(
    V1_PRODUCT_PATH, "financial_document/response_v1/summary_page0_invoice.rst"
  ),
  page0ReceiptString: path.join(
    V1_PRODUCT_PATH, "financial_document/response_v1/summary_page0_receipt.rst"
  ),
};

describe("Financial Document V1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.FinancialDocumentV1, response.document);
    const docPrediction = doc.inference.prediction;
    assert.strictEqual(docPrediction.locale.value, undefined);
    assert.strictEqual(docPrediction.totalAmount.value, undefined);
    assert.strictEqual(docPrediction.totalNet.value, undefined);
    assert.strictEqual(docPrediction.totalTax.value, undefined);
    assert.strictEqual(docPrediction.date.value, undefined);
    assert.strictEqual(docPrediction.invoiceNumber.value, undefined);
    assert.strictEqual(docPrediction.billingAddress.value, undefined);
    assert.strictEqual(docPrediction.dueDate.value, undefined);
    assert.strictEqual(docPrediction.documentNumber.value, undefined);
    assert.strictEqual(docPrediction.documentType.value, "EXPENSE RECEIPT");
    assert.strictEqual(docPrediction.documentTypeExtended.value, "EXPENSE RECEIPT");
    assert.strictEqual(docPrediction.supplierName.value, undefined);
    assert.strictEqual(docPrediction.supplierAddress.value, undefined);
    assert.strictEqual(docPrediction.customerId.value, undefined);
    assert.strictEqual(docPrediction.customerName.value, undefined);
    assert.strictEqual(docPrediction.customerAddress.value, undefined);
    assert.strictEqual(docPrediction.customerCompanyRegistrations.length, 0);
    assert.strictEqual(docPrediction.taxes.length, 0);
    assert.strictEqual(docPrediction.supplierPaymentDetails.length, 0);
    assert.strictEqual(docPrediction.supplierCompanyRegistrations.length, 0);
    assert.strictEqual(docPrediction.tip.value, undefined);
    assert.strictEqual(docPrediction.totalAmount.value, undefined);
    assert.strictEqual(docPrediction.totalNet.value, undefined);
    assert.strictEqual(docPrediction.totalTax.value, undefined);
    assert.strictEqual(docPrediction.taxes.length, 0);
    assert.strictEqual(docPrediction.date.value, undefined);
    assert.strictEqual(docPrediction.time.value, undefined);
    assert.strictEqual(docPrediction.supplierName.value, undefined);
  });

  it("should initialize from an invoice object", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoiceComplete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.FinancialDocumentV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.invoiceDocString));
    assert.strictEqual(doc.toString(), docString.toString());
  });

  it("should initialize from a receipt object", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receiptComplete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.FinancialDocumentV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.receiptDocString));
    assert.strictEqual(doc.toString(), docString.toString());
  });

  it("should load a complete page 0 invoice prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoiceComplete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.FinancialDocumentV1, response.document);
    const page0 = doc.inference.pages[0];
    const docString = await fs.readFile(path.join(dataPath.page0InvoiceString));
    assert.strictEqual(page0.orientation?.value, 0);
    assert.strictEqual(page0.toString(), docString.toString());
  });

  it("should load a complete page 0 receipt prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receiptComplete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.FinancialDocumentV1, response.document);
    const page0 = doc.inference.pages[0];
    const docString = await fs.readFile(path.join(dataPath.page0ReceiptString));
    assert.strictEqual(page0.orientation?.value, 0);
    assert.strictEqual(page0.toString(), docString.toString());
  });
});
