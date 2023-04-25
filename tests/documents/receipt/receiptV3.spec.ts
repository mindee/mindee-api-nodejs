import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";
import {
  Amount,
  DateField,
  TextField,
  Locale,
  TaxField,
} from "../../../src/fields";

const dataPath = {
  complete: "tests/data/receipt/response_v3/complete.json",
  empty: "tests/data/receipt/response_v3/empty.json",
  docString: "tests/data/receipt/response_v3/doc_to_string.txt",
  page0String: "tests/data/receipt/response_v3/page0_to_string.txt",
};

describe("Receipt Object V3 initialization", async () => {
  before(async function () {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    this.basePrediction = JSON.parse(
      jsonData.toString()
    ).document.inference.pages[0].prediction;
  });

  it("should initialize from a prediction object with N/A value", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.ReceiptV3({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect((doc.locale as Locale).value).to.be.undefined;
    expect((doc.totalIncl as Amount).value).to.be.undefined;
    expect((doc.totalTax as Amount).value).to.be.undefined;
    expect((doc.taxes as TaxField[]).length).to.be.equal(0);
    expect((doc.date as DateField).value).to.be.undefined;
    expect((doc.time as TextField).value).to.be.undefined;
    expect((doc.merchantName as TextField).value).to.be.undefined;
    for (const key in doc.checklist) {
      expect(doc.checklist[key]).to.be.false;
    }
    expect(doc.checkAll()).to.be.false;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new mindee.ReceiptV3({
      prediction: prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
    for (const key in doc.checklist) {
      expect(doc.checklist[key]).to.be.true;
    }
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new mindee.ReceiptV3({
      prediction: pageData.prediction,
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(doc.orientation?.value).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should reconstruct with N/A total", function () {
    const doc = new mindee.ReceiptV3({
      prediction: {
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
    const doc = new mindee.ReceiptV3({
      prediction: {
        ...this.basePrediction,
        total_incl: { value: 12.54, confidence: 0.5 },
        taxes: [],
      },
    });
    expect(doc.totalExcl.value).to.be.undefined;
  });

  it("should reconstruct with taxes", function () {
    const doc = new mindee.ReceiptV3({
      prediction: {
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
