import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "path";
import * as fs from "node:fs/promises";
import { Document } from "@/v1/index.js";
import { InvoiceSplitterV1 } from "@/v1/product/index.js";
import { extractInvoices } from "@/v1/extraction/index.js";
import { PathInput } from "@/index.js";
import { V1_PRODUCT_PATH } from "../../index.js";

describe("MindeeV1 - Invoice Splitter Extraction", () => {
  it("should be split into the proper invoices", async () => {
    const jsonData = await fs.readFile(
      path.join(V1_PRODUCT_PATH, "invoice_splitter/response_v1/complete.json")
    );
    const sourceDoc = new PathInput({ inputPath: path.join(V1_PRODUCT_PATH, "invoice_splitter/invoice_5p.pdf") });
    await sourceDoc.init();
    const response = JSON.parse(jsonData.toString());
    const doc = new Document(InvoiceSplitterV1, response.document);
    const extractedInvoices = await extractInvoices(sourceDoc, doc.inference, false);
    assert.strictEqual(extractedInvoices.length, 3);
    assert.strictEqual(extractedInvoices[0].pageIdMin, 0);
    assert.strictEqual(extractedInvoices[0].pageIdMax, 0);
    assert.strictEqual(extractedInvoices[1].pageIdMin, 1);
    assert.strictEqual(extractedInvoices[1].pageIdMax, 3);
    assert.strictEqual(extractedInvoices[2].pageIdMin, 4);
    assert.strictEqual(extractedInvoices[2].pageIdMax, 4);
    for (const extractedInvoice of extractedInvoices) {
      assert.ok(Buffer.byteLength(extractedInvoice.asSource().fileObject) < 10485760);
      assert.ok(Buffer.byteLength(extractedInvoice.asSource().fileObject) > 100000);
    }
  });

  it("should be split differently if confidences are taken into account.", async () => {
    const jsonData = await fs.readFile(
      path.resolve(V1_PRODUCT_PATH, "invoice_splitter/response_v1/complete.json")
    );
    const sourceDoc = new PathInput({ inputPath: path.join(V1_PRODUCT_PATH, "invoice_splitter/invoice_5p.pdf") });
    await sourceDoc.init();
    const response = JSON.parse(jsonData.toString());
    const doc = new Document(InvoiceSplitterV1, response.document);
    const extractedConfidentInvoices = await extractInvoices(sourceDoc, doc.inference, true);
    assert.strictEqual(extractedConfidentInvoices.length, 2);
  });
});
