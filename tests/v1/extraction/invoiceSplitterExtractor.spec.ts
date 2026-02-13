import assert from "node:assert/strict";
import { promises as fs } from "fs";
import path from "path";
import { InvoiceSplitterV1 } from "@/v1/product/index.js";
import { extractInvoices } from "@/v1/extraction/index.js";
import { PathInput } from "@/index.js";
import { V1_PRODUCT_PATH } from "../../index.js";

const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "invoice_splitter/response_v1/complete.json"),
  fileSample: path.join(V1_PRODUCT_PATH, "invoice_splitter/invoice_5p.pdf"),
};

describe("A multi-page invoice document #includeOptionalDeps", () => {
  it("should be split properly.", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new InvoiceSplitterV1(response.document.inference);
    const inputSample = new PathInput({ inputPath: dataPath.fileSample });
    await inputSample.init();

    const extractedInvoices = await extractInvoices(inputSample, doc);
    assert.strictEqual(extractedInvoices.length, 3);
    assert.ok(extractedInvoices[0].buffer);
    assert.ok(extractedInvoices[1].buffer);
    assert.strictEqual(extractedInvoices[0].pageIdMin, 0);
    assert.strictEqual(extractedInvoices[0].pageIdMax, 0);
    assert.strictEqual(extractedInvoices[1].pageIdMin, 1);
    assert.strictEqual(extractedInvoices[1].pageIdMax, 3);
    assert.strictEqual(extractedInvoices[2].pageIdMax, 4);
    assert.strictEqual(extractedInvoices[2].pageIdMax, 4);
  });
});
