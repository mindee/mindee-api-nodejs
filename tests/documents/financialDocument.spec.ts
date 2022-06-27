import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { dataPath } from "../apiPaths";
import { FinancialDocument } from "../../mindee/documents";
import {
  Amount,
  DateField,
  Field,
  Locale,
  TaxField,
} from "../../mindee/documents/fields";

describe("Financial Document Object initialization", async () => {
  before(async function () {
    const invoiceJsonDataNA = await fs.readFile(
      path.resolve(dataPath.invoice.empty)
    );
    const receiptJsonDataNA = await fs.readFile(
      path.resolve(dataPath.receipt.empty)
    );
    this.invoiceBasePrediction = JSON.parse(
      invoiceJsonDataNA.toString()
    ).document.inference.pages[0].prediction;
    this.receiptBasePrediction = JSON.parse(
      receiptJsonDataNA.toString()
    ).document.inference.pages[0].prediction;
  });

  it("should initialize from an invoice object", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoice.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new FinancialDocument({
      apiPrediction: response.document.inference.prediction,
    });
    expect((doc.date as DateField).value).to.be.equal(
      "2020-02-17"
    );
    expect((doc.totalTax as TaxField).value).to.be.equal(97.98);
    expect(typeof doc.toString()).to.be.equal("string");
    expect((doc.supplier as Field).value).to.be.equal(
      "TURNPIKE DESIGNS CO."
    );
  });

  it("should initialize from a receipt object", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receipt.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new FinancialDocument({
      apiPrediction: response.document.inference.pages[0].prediction,
    });
    expect((doc.date as DateField).value).to.be.equal(
      "2016-02-26"
    );
    expect((doc.totalTax as TaxField).value).to.be.equal(1.7);
    expect((doc.supplier as Field).value).to.be.equal("CLACHAN");
    expect(doc.checklist.taxesMatchTotalIncl).to.be.true;
    expect(typeof doc.toString()).to.be.equal("string");
    for (const key in doc.checklist) {
      expect(doc.checklist[key]).to.be.true;
    }
    expect((doc.invoiceNumber as Field).value).to.be.undefined;
  });

  it("should initialize from a N/A receipt", async function () {
    const doc = new FinancialDocument({
      apiPrediction: this.receiptBasePrediction,
    });
    expect((doc.locale as Locale).value).to.be.undefined;
    expect((doc.totalIncl as Amount).value).to.be.undefined;
    expect((doc.totalTax as Amount).value).to.be.undefined;
    expect(doc.taxes.length).to.be.equal(0);
    expect((doc.date as DateField).value).to.be.undefined;
    expect((doc.time as Field).value).to.be.undefined;
    expect((doc.supplier as Field).value).to.be.undefined;
    for (const key in doc.checklist) {
      expect(doc.checklist[key]).to.be.false;
    }
  });

  it("should initialize from a N/A invoice", async function () {
    const doc = new FinancialDocument({
      apiPrediction: this.invoiceBasePrediction,
    });
    expect((doc.locale as Locale).value).to.be.undefined;
    expect((doc.totalIncl as Amount).value).to.be.undefined;
    expect((doc.totalTax as Amount).value).to.be.undefined;
    expect((doc.date as DateField).value).to.be.undefined;
    expect((doc.invoiceNumber as Field).value).to.be.undefined;
    expect((doc.dueDate as DateField).value).to.be.undefined;
    expect((doc.supplier as Field).value).to.be.undefined;
    expect(doc.taxes.length).to.be.equal(0);
    expect((doc.paymentDetails as any).length).to.be.equal(0);
    expect((doc.companyNumber as any).length).to.be.equal(0);
    expect(doc.orientation).to.be.undefined;
    expect(Object.values(doc.checklist)).to.have.ordered.members([
      false,
    ]);
    expect(doc.checkAll()).to.be.false;
  });
});
