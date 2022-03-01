const fs = require("fs").promises;
const path = require("path");
const FinancialDocument = require("../../mindee/documents/financialDocument");
const expect = require("chai").expect;
const api_path = require("../data/api/api_paths.json");

describe("Financial Document Object initialization", async () => {
  before(async function () {
    const invoiceJsonDataNA = await fs.readFile(
      path.resolve(api_path.invoices.all_na)
    );
    const receiptJsonDataNA = await fs.readFile(
      path.resolve(api_path.receipts.all_na)
    );
    this.invoiceBasePrediction = JSON.parse(
      invoiceJsonDataNA
    ).data.document.inference.pages[0].prediction;
    this.receiptBasePrediction = JSON.parse(
      receiptJsonDataNA
    ).data.document.inference.pages[0].prediction;
  });

  it("should initialize from an invoice object", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.invoices.all));
    const response = JSON.parse(jsonData);
    const financialDocument = new FinancialDocument({
      apiPrediction: response.data.document.inference.pages[0].prediction,
    });
    expect(financialDocument.date.value).to.be.equal("2020-09-20");
    expect(financialDocument.totalTax.value).to.be.equal(44.41);
    expect(typeof financialDocument.toString()).to.be.equal("string");
    expect(financialDocument.supplier.value).to.be.equal("COMPANY");
  });

  it("should initialize from a receipt object", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.receipts.all));
    const response = JSON.parse(jsonData);
    const financialDocument = new FinancialDocument({
      apiPrediction: response.data.document.inference.pages[0].prediction,
    });
    expect(financialDocument.date.value).to.be.equal("2018-04-08");
    expect(financialDocument.totalTax.value).to.be.equal(0.43);
    expect(financialDocument.supplier.value).to.be.equal("SSP");
    expect(financialDocument.checklist.taxesMatchTotalIncl).to.be.true;
    expect(typeof financialDocument.toString()).to.be.equal("string");
    for (const key in financialDocument.checklist) {
      expect(financialDocument.checklist[key]).to.be.true;
    }
    expect(financialDocument.invoiceNumber.value).to.be.undefined;
  });

  it("should initialize from a N/A receipt", async function () {
    const financialDocument = new FinancialDocument({
      apiPrediction: this.receiptBasePrediction,
    });
    expect(financialDocument.locale.value).to.be.undefined;
    expect(financialDocument.totalIncl.value).to.be.undefined;
    expect(financialDocument.totalTax.value).to.be.undefined;
    expect(financialDocument.taxes.length).to.be.equal(0);
    expect(financialDocument.date.value).to.be.undefined;
    expect(financialDocument.time.value).to.be.undefined;
    expect(financialDocument.supplier.value).to.be.undefined;
    for (const key in financialDocument.checklist) {
      expect(financialDocument.checklist[key]).to.be.false;
    }
  });

  it("should initialize from a N/A invoice", async function () {
    const financialDocument = new FinancialDocument({
      apiPrediction: this.invoiceBasePrediction,
    });
    expect(financialDocument.locale.value).to.be.undefined;
    expect(financialDocument.totalIncl.value).to.be.undefined;
    expect(financialDocument.totalExcl.value).to.be.undefined;
    expect(financialDocument.date.value).to.be.undefined;
    expect(financialDocument.invoiceNumber.value).to.be.undefined;
    expect(financialDocument.dueDate.value).to.be.undefined;
    expect(financialDocument.supplier.value).to.be.undefined;
    expect(financialDocument.taxes.length).to.be.equal(0);
    expect(financialDocument.paymentDetails.length).to.be.equal(0);
    expect(financialDocument.companyNumber.length).to.be.equal(0);
    expect(financialDocument.orientation.value).to.be.equal(0);
    expect(Object.values(financialDocument.checklist)).to.have.ordered.members([
      false,
    ]);
  });
});
