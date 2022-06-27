import { Receipt } from "../../mindee/documents";
import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { dataPath } from "../apiPaths";
import {
  Amount,
  DateField,
  Field,
  Locale,
  TaxField,
} from "../../mindee/documents/fields";

describe("Receipt Object initialization", async () => {
  before(async function () {
    const jsonData = await fs.readFile(path.resolve(dataPath.receipt.empty));
    this.basePrediction = JSON.parse(
      jsonData.toString()
    ).document.inference.pages[0].prediction;
  });

  it("should initialize from a prediction object with N/A value", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receipt.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new Receipt({
      apiPrediction: response.document.inference.pages[0].prediction,
    });
    expect((doc.locale as Locale).value).to.be.undefined;
    expect((doc.totalIncl as Amount).value).to.be.undefined;
    expect((doc.totalTax as Amount).value).to.be.undefined;
    expect((doc.taxes as TaxField[]).length).to.be.equal(0);
    expect((doc.date as DateField).value).to.be.undefined;
    expect((doc.time as Field).value).to.be.undefined;
    expect((doc.merchantName as Field).value).to.be.undefined;
    for (const key in doc.checklist) {
      expect(doc.checklist[key]).to.be.false;
    }
    expect(doc.checkAll()).to.be.false;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receipt.complete));
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new Receipt({
      apiPrediction: prediction,
    });
    const to_string = await fs.readFile(path.join(dataPath.receipt.docString));
    expect(doc.toString()).to.be.equals(to_string.toString());
    for (const key in doc.checklist) {
      expect(doc.checklist[key]).to.be.true;
    }
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receipt.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new Receipt({
      apiPrediction: pageData.prediction,
      pageNumber: pageData.id,
    });
    const to_string = await fs.readFile(
      path.join(dataPath.receipt.page0String)
    );
    expect(doc.toString()).to.be.equals(to_string.toString());
  });

  it("should reconstruct with N/A total", function () {
    const doc = new Receipt({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: "N/A", confidence: 0.5 },
        taxes: [
          { rate: 20, value: 0.5, confidence: 0.1 },
          { rate: 10, value: 4.25, confidence: 0.6 },
        ],
      },
    });
    expect(doc.totalExcl.value).to.be.undefined;
  });

  it("should reconstruct with empty taxes", function () {
    const doc = new Receipt({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 12.54, confidence: 0.5 },
        taxes: [],
      },
    });
    expect(doc.totalExcl.value).to.be.undefined;
  });

  it("should reconstruct with taxes", function () {
    const doc = new Receipt({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 12.54, confidence: 0.5 },
        taxes: [
          { rate: 20, value: 0.5, confidence: 0.1 },
          { rate: 10, value: 4.25, confidence: 0.6 },
        ],
      },
    });
    expect(doc.totalExcl.confidence).to.be.equal(0.03);
    expect(doc.totalExcl.value).to.be.equal(7.79);
  });
});
