const fs = require("fs").promises;
const path = require("path");
const FinancialDocument = require("mindee").documents.financialDocument;
const expect = require("chai").expect;

describe("Financial Document Object initialization", async () => {
  before(async function () {
    const invoiceJsonDataNA = await fs.readFile(
      path.resolve("tests/data/api/invoice/v2/invoice_all_na.json")
    );
    const receiptJsonDataNA = await fs.readFile(
      path.resolve("tests/data/api/receipt/v3/receipt_all_na.json")
    );
    this.invoiceBasePrediction = JSON.parse(invoiceJsonDataNA).predictions[0];
    this.receiptBasePrediction = JSON.parse(
      receiptJsonDataNA
    ).data.predictions[0];
  });

  it("should initialize from a v2 invoice object", async () => {
    const jsonData = await fs.readFile(
      path.resolve("tests/data/api/invoice/v2/invoice.json")
    );
    const response = JSON.parse(jsonData);
    const financialDocument = new FinancialDocument({
      apiPrediction: response.predictions[0],
    });
    expect(financialDocument.date.value).to.be.equal("2020-02-17");
    expect(financialDocument.totalTax.value).to.be.equal(97.98);
    expect(typeof financialDocument.toString()).to.be.equal("string");
    expect(financialDocument.merchantName.value).to.be.undefined;
  });

  it("should initialize from a v3 receipt object", async () => {
    const jsonData = await fs.readFile(
      path.resolve("tests/data/api/receipt/v3/receipt.json")
    );
    const response = JSON.parse(jsonData);
    const financialDocument = new FinancialDocument({
      apiPrediction: response.data.predictions[0],
    });
    expect(financialDocument.date.value).to.be.equal("2016-02-26");
    expect(financialDocument.totalTax.value).to.be.equal(1.7);
    expect(financialDocument.merchantName.value).to.be.equal("CLACHAN");
    expect(financialDocument.checklist.taxesMatchTotalIncl).to.be.true;
    expect(typeof financialDocument.toString()).to.be.equal("string");
    for (const key in financialDocument.checklist) {
      expect(financialDocument.checklist[key]).to.be.true;
    }
    expect(financialDocument.invoiceDate.value).to.be.undefined;
    expect(financialDocument.invoiceNumber.value).to.be.undefined;
    expect(financialDocument.dueDate.value).to.be.undefined;
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
    expect(financialDocument.merchantName.value).to.be.undefined;
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
    expect(financialDocument.invoiceDate.value).to.be.undefined;
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
