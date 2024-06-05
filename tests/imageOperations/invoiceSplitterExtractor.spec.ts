import { expect } from "chai";
import { promises as fs } from "fs";
import path from "path";
import { InvoiceSplitterV1 } from "../../src/product";
import { extractInvoices } from "../../src/imageOperations";
import { PathInput } from "../../src/input";

const dataPath = {
  complete: "tests/data/products/invoice_splitter/response_v1/complete.json",
  fileSample: "tests/data/products/invoice_splitter/invoice_5p.pdf"
}

describe("A multi-page invoice document", () => {
  it("should be split properly.", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new InvoiceSplitterV1(response.document.inference);
    const inputSample = new PathInput({ inputPath: dataPath.fileSample });
    await inputSample.init();

    const extractedInvoices = await extractInvoices(inputSample, doc);
    expect(extractedInvoices.length).to.be.equals(3);
    expect(extractedInvoices[0].buffer).to.be.not.null;
    expect(extractedInvoices[1].buffer).to.be.not.null;
    expect(extractedInvoices[0].pageIdMin).to.be.equals(0);
    expect(extractedInvoices[0].pageIdMax).to.be.equals(0);
    expect(extractedInvoices[1].pageIdMin).to.be.equals(1);
    expect(extractedInvoices[1].pageIdMax).to.be.equals(3);
    expect(extractedInvoices[2].pageIdMax).to.be.equals(4);
    expect(extractedInvoices[2].pageIdMax).to.be.equals(4);
  });
});
