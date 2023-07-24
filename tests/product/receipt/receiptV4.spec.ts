import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";
import { Page } from "../../../src/parsing/common";
import { ReceiptV4Document } from "../../../src/product/receipt/receiptV4Document";
import { ReceiptV4 } from "../../../src/product";

const dataPath = {
  complete: "tests/data/receipt/response_v4/complete.json",
  empty: "tests/data/receipt/response_v4/empty.json",
  docString: "tests/data/receipt/response_v4/summary_full.rst",
  page0String: "tests/data/receipt/response_v4/summary_page0.rst",
};

describe("Receipt Object V4 initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const docPrediction = new mindee.Document(ReceiptV4, response.document).inference?.prediction as ReceiptV4Document;
    expect(docPrediction.locale.value).to.be.undefined;
    expect(docPrediction.date.value).to.be.undefined;
    expect(docPrediction.time.value).to.be.undefined;
    expect(docPrediction.totalAmount.value).to.be.undefined;
    expect(docPrediction.totalNet.value).to.be.undefined;
    expect(docPrediction.totalTax.value).to.be.undefined;
    expect(docPrediction.tip.value).to.be.undefined;
    expect(docPrediction.taxes.length).to.be.equals(0);
    expect(docPrediction.supplier.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(ReceiptV4, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(ReceiptV4, response.document);
    const docString = await fs.readFile(path.join(dataPath.page0String));
    const page0: Page<ReceiptV4Document> = doc.inference?.pages[0] as Page<ReceiptV4Document>;
    expect(page0.orientation?.value).to.be.equals(0);
    expect(page0.toString()).to.be.equals(docString.toString());
  });
});
