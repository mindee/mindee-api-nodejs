import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { dataPath } from "../../apiPaths";
import { FinancialDocumentV1 } from "../../../src";
import {
  Amount,
  DateField,
  TextField,
  Locale,
  TaxField,
} from "../../../src/fields";

describe("Financial Document V1 Object initialization", async () => {
  it("should initialize from a prediction object with N/A value", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.financialDocumentV1.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new FinancialDocumentV1({
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
    expect(doc.paymentDetails.length).to.be.equal(0);
    expect(doc.supplierCompanyRegistrations.length).to.be.equal(0);
    expect(doc.orientation).to.be.undefined;
    expect((doc.locale as Locale).value).to.be.undefined;
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
    const jsonData = await fs.readFile(
      path.resolve(dataPath.financialDocumentV1.invoiceComplete)
    );
    const response = JSON.parse(jsonData.toString());
    const doc = new FinancialDocumentV1({
      prediction: response.document.inference.prediction,
    });
    const docString = await fs.readFile(
      path.join(dataPath.financialDocumentV1.invoiceDocString)
    );
    expect(doc.toString()).to.be.equals(docString.toString());
  });
  it("should initialize from a receipt object", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.financialDocumentV1.receiptComplete)
    );
    const response = JSON.parse(jsonData.toString());
    const doc = new FinancialDocumentV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    const docString = await fs.readFile(
      path.join(dataPath.financialDocumentV1.receiprDocString)
    );
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
