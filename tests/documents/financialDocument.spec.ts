import { promises as fs } from "fs";
import path from "path";
import { expect } from "chai";
import * as api_path from "../data/apiPaths.json";
import { FinancialDocument } from "../../mindee/documents";
import {
  Amount,
  DateField,
  Field,
  Locale,
  Orientation,
  TaxField,
} from "../../mindee/documents/fields";

describe("Financial Document Object initialization", async () => {
  before(async function () {
    const invoiceJsonDataNA = await fs.readFile(
      path.resolve(api_path.invoices.all_na)
    );
    const receiptJsonDataNA = await fs.readFile(
      path.resolve(api_path.receipts.all_na)
    );
    this.invoiceBasePrediction = JSON.parse(
      invoiceJsonDataNA.toString()
    ).document.inference.pages[0].prediction;
    this.receiptBasePrediction = JSON.parse(
      receiptJsonDataNA.toString()
    ).document.inference.pages[0].prediction;
  });

  it("should initialize from an invoice object", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.invoices.all));
    const response = JSON.parse(jsonData.toString());
    const financialDocument = new FinancialDocument({
      apiPrediction: response.document.inference.pages[0].prediction,
    });
    expect((financialDocument.date as DateField).value).to.be.equal(
      "2020-02-17"
    );
    expect((financialDocument.totalTax as TaxField).value).to.be.equal(97.98);
    expect(typeof financialDocument.toString()).to.be.equal("string");
    expect((financialDocument.supplier as Field).value).to.be.equal(
      "TURNPIKE DESIGNS CO."
    );
  });

  it("should initialize from a receipt object", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.receipts.all));
    const response = JSON.parse(jsonData.toString());
    const financialDocument = new FinancialDocument({
      apiPrediction: response.document.inference.pages[0].prediction,
    });
    expect((financialDocument.date as DateField).value).to.be.equal(
      "2016-02-26"
    );
    expect((financialDocument.totalTax as TaxField).value).to.be.equal(1.7);
    expect((financialDocument.supplier as Field).value).to.be.equal("CLACHAN");
    expect(financialDocument.checklist.taxesMatchTotalIncl).to.be.true;
    expect(typeof financialDocument.toString()).to.be.equal("string");
    for (const key in financialDocument.checklist) {
      expect(financialDocument.checklist[key]).to.be.true;
    }
    expect((financialDocument.invoiceNumber as Field).value).to.be.undefined;
  });

  it("should initialize from a N/A receipt", async function () {
    const financialDocument = new FinancialDocument({
      apiPrediction: this.receiptBasePrediction,
    });
    expect((financialDocument.locale as Locale).value).to.be.undefined;
    expect((financialDocument.totalIncl as Amount).value).to.be.undefined;
    expect((financialDocument.totalTax as Amount).value).to.be.undefined;
    expect((financialDocument.taxes as TaxField[]).length).to.be.equal(0);
    expect((financialDocument.date as DateField).value).to.be.undefined;
    expect((financialDocument.time as Field).value).to.be.undefined;
    expect((financialDocument.supplier as Field).value).to.be.undefined;
    for (const key in financialDocument.checklist) {
      expect(financialDocument.checklist[key]).to.be.false;
    }
  });

  it("should initialize from a N/A invoice", async function () {
    const financialDocument = new FinancialDocument({
      apiPrediction: this.invoiceBasePrediction,
    });
    expect((financialDocument.locale as Locale).value).to.be.undefined;
    expect((financialDocument.totalIncl as Amount).value).to.be.undefined;
    expect((financialDocument.totalTax as Amount).value).to.be.undefined;
    expect((financialDocument.date as DateField).value).to.be.undefined;
    expect((financialDocument.invoiceNumber as Field).value).to.be.undefined;
    expect((financialDocument.dueDate as DateField).value).to.be.undefined;
    expect((financialDocument.supplier as Field).value).to.be.undefined;
    expect((financialDocument.taxes as TaxField[]).length).to.be.equal(0);
    expect((financialDocument.paymentDetails as any).length).to.be.equal(0);
    expect((financialDocument.companyNumber as any).length).to.be.equal(0);
    expect((financialDocument.orientation as Orientation).value).to.be.equal(0);
    expect(Object.values(financialDocument.checklist)).to.have.ordered.members([
      false,
    ]);
  });
});
