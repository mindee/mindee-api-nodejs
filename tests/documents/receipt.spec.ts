import { Receipt } from "../../mindee/documents";
import { promises as fs } from "fs";
import path from "path";
import { expect } from "chai";
import * as api_path from "../data/apiPaths.json";
import {
  Amount,
  DateField,
  Field,
  Locale,
  TaxField,
} from "../../mindee/documents/fields";

describe("Receipt Object initialization", async () => {
  before(async function () {
    const jsonData = await fs.readFile(path.resolve(api_path.receipts.all_na));
    this.basePrediction = JSON.parse(
      jsonData.toString()
    ).document.inference.pages[0].prediction;
  });

  it("should initialize from a prediction object", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.receipts.all));
    const response = JSON.parse(jsonData.toString());
    const receipt = new Receipt({
      apiPrediction: response.document.inference.pages[0].prediction,
    });
    expect((receipt.date as DateField).value).to.be.equal("2016-02-26");
    expect((receipt.totalTax as Amount).value).to.be.equal(1.7);
    expect((receipt.merchantName as Field).value).to.be.equal("CLACHAN");
    expect(receipt.checklist.taxesMatchTotalIncl).to.be.true;
    expect(typeof receipt.toString()).to.be.equal("string");
    for (const key in receipt.checklist) {
      expect(receipt.checklist[key]).to.be.true;
    }
  });

  it("should initialize from a prediction object with N/A value", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.receipts.all_na));
    const response = JSON.parse(jsonData.toString());
    const receipt = new Receipt({
      apiPrediction: response.document.inference.pages[0].prediction,
    });
    expect((receipt.locale as Locale).value).to.be.undefined;
    expect((receipt.totalIncl as Amount).value).to.be.undefined;
    expect((receipt.totalTax as Amount).value).to.be.undefined;
    expect((receipt.taxes as TaxField[]).length).to.be.equal(0);
    expect((receipt.date as DateField).value).to.be.undefined;
    expect((receipt.time as Field).value).to.be.undefined;
    expect((receipt.merchantName as Field).value).to.be.undefined;
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
    expect((receiptTotalInclNA.totalExcl as Amount).value).to.be.undefined;
  });

  it("should reconstruct with empty taxes", function () {
    const receiptNoTaxes = new Receipt({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 12.54, confidence: 0.5 },
        taxes: [],
      },
    });
    expect((receiptNoTaxes.totalExcl as Amount).value).to.be.undefined;
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
    expect((receipt.totalExcl as Amount).confidence).to.be.equal(0.03);
    expect((receipt.totalExcl as Amount).value).to.be.equal(7.79);
  });
});
