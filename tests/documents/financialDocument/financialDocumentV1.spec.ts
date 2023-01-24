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
    expect(doc.supplierPaymentDetails.length).to.be.equal(0);
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
    expect((doc.supplier as TextField).value).to.be.undefined;
  });
it("should initialize from a receipt prediction object with N/A value", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.financialDocumentV1.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new FinancialDocumentV1({
      prediction: response.document.inference.pages[0].prediction,
    });
  });
  it.only("should initialize from an invoice object", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.invoiceV4.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const doc = new FinancialDocumentV1({
      prediction: response.document.inference.prediction,
    });
    expect((doc.date as DateField).value).to.be.equal("2020-02-17");
    expect((doc.totalTax as TaxField).value).to.be.equal(97.98);
    expect(typeof doc.toString()).to.be.equal("string");
    expect((doc.supplier as TextField).value).to.be.equal("TURNPIKE DESIGNS CO.");
  });
  it("should initialize from a receipt object", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.receiptV4.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const doc = new FinancialDocumentV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect((doc.date as DateField).value).to.be.equal("2016-02-26");
    expect((doc.totalTax as TaxField).value).to.be.equal(1.7);
    expect((doc.supplier as TextField).value).to.be.equal("CLACHAN");
    expect(doc.checklist.taxesMatchTotalIncl).to.be.true;
    expect(typeof doc.toString()).to.be.equal("string");
    for (const key in doc.checklist) {
      expect(doc.checklist[key]).to.be.true;
    }
    expect((doc.invoiceNumber as TextField).value).to.be.undefined;
  });
});
