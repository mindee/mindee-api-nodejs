import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";

const dataPath = {
  receiptComplete:
    "tests/data/financial_document/response_v1/complete_receipt.json",
  invoiceComplete:
    "tests/data/financial_document/response_v1/complete_invoice.json",
  empty: "tests/data/financial_document/response_v1/empty.json",
  invoiceDocString:
    "tests/data/financial_document/response_v1/summary_full_invoice.rst",
  receiptDocString:
    "tests/data/financial_document/response_v1/summary_full_receipt.rst",
};

describe("Financial Document V1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.FinancialDocumentV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.locale.value).to.be.undefined;
    expect(docPrediction.totalAmount.value).to.be.undefined;
    expect(docPrediction.totalNet.value).to.be.undefined;
    expect(docPrediction.totalTax.value).to.be.undefined;
    expect(docPrediction.date.value).to.be.undefined;
    expect(docPrediction.invoiceNumber.value).to.be.undefined;
    expect(docPrediction.dueDate.value).to.be.undefined;
    expect(docPrediction.supplierName.value).to.be.undefined;
    expect(docPrediction.supplierAddress.value).to.be.undefined;
    expect(docPrediction.customerName.value).to.be.undefined;
    expect(docPrediction.customerAddress.value).to.be.undefined;
    expect(docPrediction.customerCompanyRegistrations.length).to.be.eq(0);
    expect(docPrediction.taxes.length).to.be.equal(0);
    expect(docPrediction.supplierPaymentDetails.length).to.be.equal(0);
    expect(docPrediction.supplierCompanyRegistrations.length).to.be.equal(0);
    expect(docPrediction.tip.value).to.be.undefined;
    expect(docPrediction.totalAmount.value).to.be.undefined;
    expect(docPrediction.totalNet.value).to.be.undefined;
    expect(docPrediction.totalTax.value).to.be.undefined;
    expect(docPrediction.taxes.length).to.be.equal(0);
    expect(docPrediction.date.value).to.be.undefined;
    expect(docPrediction.time.value).to.be.undefined;
    expect(docPrediction.supplierName.value).to.be.undefined;
  });

  it("should initialize from an invoice object", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoiceComplete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.FinancialDocumentV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.invoiceDocString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should initialize from a receipt object", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receiptComplete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.FinancialDocumentV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.receiptDocString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});