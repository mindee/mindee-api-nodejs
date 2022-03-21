import { Receipt } from "@mindee/documents";
import fs from "fs/promises";
import path from "path";
import { expect } from "chai";
import * as api_path from "#apiPaths";

describe("Receipt Object initialization", async () => {
  before(async function () {
    const jsonData = await fs.readFile(path.resolve(api_path.receipts.all_na));
    this.basePrediction =
      JSON.parse(jsonData).data.document.inference.pages[0].prediction;
  });

  it("should initialize from a prediction object", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.receipts.all));
    const response = JSON.parse(jsonData);
    const receipt = new Receipt({
      apiPrediction: response.data.document.inference.pages[0].prediction,
    });
    expect(receipt.date.value).to.be.equal("2016-02-26");
    expect(receipt.totalTax.value).to.be.equal(1.7);
    expect(receipt.merchantName.value).to.be.equal("CLACHAN");
    expect(receipt.checklist.taxesMatchTotalIncl).to.be.true;
    expect(typeof receipt.toString()).to.be.equal("string");
    for (const key in receipt.checklist) {
      expect(receipt.checklist[key]).to.be.true;
    }
  });

  it("should initialize from scratch", () => {
    const params = {
      totalIncl: 11.0,
      totalExcl: 10.0,
      taxes: [[1, 10]],
      date: "2019-06-21",
      time: "10:50",
      merchantName: "Amazon",
      totalTax: 1.0,
    };
    const receipt = new Receipt(params);
    expect(receipt.totalIncl.value).to.be.equal(params.totalIncl);
    expect(receipt.totalExcl.value).to.be.equal(params.totalExcl);
    expect(receipt.taxes.length).to.be.equal(params.taxes.length);
    expect(receipt.date.value).to.be.equal(params.date);
    expect(receipt.time.value).to.be.equal(params.time);
    expect(receipt.merchantName.value).to.be.equal(params.merchantName);
    expect(receipt.totalTax.value).to.be.equal(params.totalTax);
    for (const key in receipt.checklist) {
      expect(receipt.checklist[key]).to.be.true;
    }
  });

  it("should initialize from a prediction object with N/A value", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.receipts.all_na));
    const response = JSON.parse(jsonData);
    const receipt = new Receipt({
      apiPrediction: response.data.document.inference.pages[0].prediction,
    });
    expect(receipt.locale.value).to.be.undefined;
    expect(receipt.totalIncl.value).to.be.undefined;
    expect(receipt.totalTax.value).to.be.undefined;
    expect(receipt.taxes.length).to.be.equal(0);
    expect(receipt.date.value).to.be.undefined;
    expect(receipt.time.value).to.be.undefined;
    expect(receipt.merchantName.value).to.be.undefined;
    for (const key in receipt.checklist) {
      expect(receipt.checklist[key]).to.be.false;
    }
  });

  it("should reconstruct with N/A total", function () {
    const receiptTotalInclNA = new Receipt({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: "N/A", confidence: 0.5 },
        taxes: [
          { rate: 20, value: 0.5, confidence: 0.1 },
          { rate: 10, value: 4.25, confidence: 0.6 },
        ],
      },
    });
    expect(receiptTotalInclNA.totalExcl.value).to.be.undefined;
  });

  it("should reconstruct with empty taxes", function () {
    const receiptNoTaxes = new Receipt({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 12.54, confidence: 0.5 },
        taxes: [],
      },
    });
    expect(receiptNoTaxes.totalExcl.value).to.be.undefined;
  });

  it("should reconstruct with taxes", function () {
    const receipt = new Receipt({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 12.54, confidence: 0.5 },
        taxes: [
          { rate: 20, value: 0.5, confidence: 0.1 },
          { rate: 10, value: 4.25, confidence: 0.6 },
        ],
      },
    });
    expect(receipt.totalExcl.probability).to.be.equal(0.03);
    expect(receipt.totalExcl.value).to.be.equal(7.79);
  });
});
