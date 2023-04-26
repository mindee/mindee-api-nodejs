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
  complete: "tests/data/receipt/response_v4/complete.json",
  empty: "tests/data/receipt/response_v4/empty.json",
  docString: "tests/data/receipt/response_v4/doc_to_string.txt",
  page0String: "tests/data/receipt/response_v4/page0_to_string.txt",
};

describe("Receipt Object V4 initialization", async () => {
  it("should initialize from a prediction object with N/A value", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.ReceiptV4({
      prediction: response.document.inference.pages[0].prediction,
    });
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

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new mindee.ReceiptV4({
      prediction: prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new mindee.ReceiptV4({
      prediction: pageData.prediction,
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(doc.orientation?.value).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
