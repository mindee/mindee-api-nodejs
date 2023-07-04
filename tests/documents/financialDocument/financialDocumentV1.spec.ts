import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";
import { Amount, DateField, TextField, TaxField } from "../../../src/parsing/standard";

const dataPath = {
  receiptComplete:
    "tests/data/financial_document/response_v1/complete_receipt.json",
  invoiceComplete:
    "tests/data/financial_document/response_v1/complete_invoice.json",
  empty: "tests/data/financial_document/response_v1/empty.json",
  invoiceDocString:
    "tests/data/financial_document/response_v1/invoice_to_string.rst",
  receiptDocString:
    "tests/data/financial_document/response_v1/receipt_to_string.rst",
};

describe("Financial Document V1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.FinancialDocumentV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.locale.value).to.be.undefined;
    expect(doc.totalAmount.value).to.be.undefined;
    expect(doc.totalNet.value).to.be.undefined;
    expect(doc.totalTax.value).to.be.undefined;
    expect(doc.date.value).to.be.undefined;
    expect(doc.invoiceNumber.value).to.be.undefined;
    expect(doc.dueDate.value).to.be.undefined;
    expect(doc.supplierName.value).to.be.undefined;
    expect(doc.supplierAddress.value).to.be.undefined;
    expect(doc.customerName.value).to.be.undefined;
    expect(doc.customerAddress.value).to.be.undefined;
    expect(doc.customerCompanyRegistrations.length).to.be.eq(0);
    expect(doc.taxes.length).to.be.equal(0);
    expect(doc.supplierPaymentDetails.length).to.be.equal(0);
    expect(doc.supplierCompanyRegistrations.length).to.be.equal(0);
    expect(doc.orientation).to.be.undefined;
    expect((doc.tip as Amount).value).to.be.undefined;
    expect((doc.totalAmount as Amount).value).to.be.undefined;
    expect((doc.totalNet as Amount).value).to.be.undefined;
    expect((doc.totalTax as Amount).value).to.be.undefined;
    expect((doc.taxes as TaxField[]).length).to.be.equal(0);
    expect((doc.date as DateField).value).to.be.undefined;
    expect((doc.time as TextField).value).to.be.undefined;
    expect((doc.supplierName as TextField).value).to.be.undefined;
  });

  it("should initialize from an invoice object", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoiceComplete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.FinancialDocumentV1({
      prediction: response.document.inference.prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.invoiceDocString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should initialize from a receipt object", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receiptComplete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.FinancialDocumentV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.receiptDocString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
