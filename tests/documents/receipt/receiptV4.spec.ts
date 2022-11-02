import { ReceiptV4 } from "../../../src/documents";
import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { dataPath } from "../../apiPaths";
import {
  Amount,
  DateField,
  Field,
  Locale,
  TaxField,
} from "../../../src/fields";

describe("Receipt Object V4 initialization", async () => {
  it("should initialize from a prediction object with N/A value", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receiptV4.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new ReceiptV4({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect((doc.locale as Locale).value).to.be.undefined;
    expect((doc.tip as Amount).value).to.be.undefined;
    expect((doc.totalAmount as Amount).value).to.be.undefined;
    expect((doc.totalNet as Amount).value).to.be.undefined;
    expect((doc.totalTax as Amount).value).to.be.undefined;
    expect((doc.taxes as TaxField[]).length).to.be.equal(0);
    expect((doc.date as DateField).value).to.be.undefined;
    expect((doc.time as Field).value).to.be.undefined;
    expect((doc.supplier as Field).value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.receiptV4.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new ReceiptV4({
      prediction: prediction,
    });
    const docString = await fs.readFile(
      path.join(dataPath.receiptV4.docString)
    );
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.receiptV4.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new ReceiptV4({
      prediction: pageData.prediction,
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    const docString = await fs.readFile(
      path.join(dataPath.receiptV4.page0String)
    );
    expect(doc.orientation?.value).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
