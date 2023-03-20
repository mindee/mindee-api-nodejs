import { promises as fs } from "fs";
import * as path from "path";
import { InvoiceSplitterV1 } from "../../../src/documents";
import { expect } from "chai";
import { dataPath } from "../../apiPaths";

describe("InvoiceSplitter Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(
      path.resolve(dataPath.invoiceSplitterV1.empty)
    );
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new InvoiceSplitterV1({
      prediction: response.document.inference,
    });
    expect(doc.invoicePageGroups.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.invoiceSplitterV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new InvoiceSplitterV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(
      path.join(dataPath.invoiceSplitterV1.docString)
    );
    expect(doc.invoicePageGroups.length).to.be.equals(3);
    expect(doc.invoicePageGroups[0].confidence).to.be.equals(1);
    expect(doc.invoicePageGroups[2].confidence).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
  });

});
