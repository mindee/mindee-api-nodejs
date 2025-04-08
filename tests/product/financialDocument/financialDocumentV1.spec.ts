import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";

const dataPath = {
  receiptComplete:
    "tests/data/products/financial_document/response_v1/complete_receipt.json",
  invoiceComplete:
    "tests/data/products/financial_document/response_v1/complete_invoice.json",
  empty: "tests/data/products/financial_document/response_v1/empty.json",
  invoiceDocString:
    "tests/data/products/financial_document/response_v1/summary_full_invoice.rst",
  receiptDocString:
    "tests/data/products/financial_document/response_v1/summary_full_receipt.rst",
  page0InvoiceString:
    "tests/data/products/financial_document/response_v1/summary_page0_invoice.rst",
  page0ReceiptString:
    "tests/data/products/financial_document/response_v1/summary_page0_receipt.rst",
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
    expect(docPrediction.billingAddress.value).to.be.undefined;
    expect(docPrediction.dueDate.value).to.be.undefined;
    expect(docPrediction.documentNumber.value).to.be.undefined;
    expect(docPrediction.documentType.value).to.be.eq("EXPENSE RECEIPT");
    expect(docPrediction.documentTypeExtended.value).to.be.eq("EXPENSE RECEIPT");
    expect(docPrediction.supplierName.value).to.be.undefined;
    expect(docPrediction.supplierAddress.value).to.be.undefined;
    expect(docPrediction.customerId.value).to.be.undefined;
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

  it("should load a complete page 0 invoice prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoiceComplete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.FinancialDocumentV1, response.document);
    const page0 = doc.inference.pages[0];
    const docString = await fs.readFile(path.join(dataPath.page0InvoiceString));
    expect(page0.orientation?.value).to.be.equals(0);
    expect(page0.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 receipt prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receiptComplete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.FinancialDocumentV1, response.document);
    const page0 = doc.inference.pages[0];
    const docString = await fs.readFile(path.join(dataPath.page0ReceiptString));
    expect(page0.orientation?.value).to.be.equals(0);
    expect(page0.toString()).to.be.equals(docString.toString());
  });
});
