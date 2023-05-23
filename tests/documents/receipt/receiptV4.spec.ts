import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";

const dataPath = {
  complete: "tests/data/receipt/response_v4/complete.json",
  empty: "tests/data/receipt/response_v4/empty.json",
  docString: "tests/data/receipt/response_v4/doc_to_string.rst",
  page0String: "tests/data/receipt/response_v4/page0_to_string.rst",
};

describe("Receipt Object V4 initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.ReceiptV4({
      prediction: response.document.inference.prediction,
    });
    expect(doc.locale.value).to.be.undefined;
    expect(doc.date.value).to.be.undefined;
    expect(doc.time.value).to.be.undefined;
    expect(doc.totalAmount.value).to.be.undefined;
    expect(doc.totalNet.value).to.be.undefined;
    expect(doc.totalTax.value).to.be.undefined;
    expect(doc.tip.value).to.be.undefined;
    expect(doc.taxes.length).to.be.equals(0);
    expect(doc.supplier.value).to.be.undefined;
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
