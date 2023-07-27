import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";
import { InvoiceSplitterV1 } from "../../../src/product";

const dataPath = {
  complete: "tests/data/invoice_splitter/response_v1/complete.json",
  empty: "tests/data/invoice_splitter/response_v1/empty.json",
  docString: "tests/data/invoice_splitter/response_v1/summary_full.rst",
};

describe("InvoiceSplitter Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new InvoiceSplitterV1(response.document.inference).prediction;
    expect(doc?.invoicePageGroups.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(InvoiceSplitterV1, response.document);
    const prediction = doc.inference.prediction;
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
    expect(prediction.invoicePageGroups.length).to.be.equals(3);
    expect(prediction.invoicePageGroups[0].confidence).to.be.equals(1);
    expect(prediction.invoicePageGroups[2].confidence).to.be.equals(0);
  });
});
