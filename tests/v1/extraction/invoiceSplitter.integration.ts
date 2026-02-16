import assert from "node:assert/strict";
import { promises as fs } from "fs";
import path from "path";
import * as mindee from "@/index.js";
import { InvoiceSplitterV1 } from "@/v1/product/index.js";
import { levenshteinRatio } from "../../testingUtilities.js";
import { V1_PRODUCT_PATH } from "../../index.js";

describe("MindeeV1 - Integration - InvoiceSplitterV1 #OptionalDepsRequired", async () => {
  let client: mindee.v1.Client;

  beforeEach(() => {
    client = new mindee.v1.Client();
  });

  it("should extract invoices in strict mode.", async () => {
    const sample = new mindee.PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "invoice_splitter/default_sample.pdf")
    });

    const response = await client.enqueueAndParse(
      mindee.v1.product.InvoiceSplitterV1, sample
    );
    const invoiceSplitterInference = response.document?.inference;
    assert.ok(invoiceSplitterInference instanceof InvoiceSplitterV1);
    const invoices = await mindee.v1.extraction.extractInvoices(
      sample,
      invoiceSplitterInference as InvoiceSplitterV1
    );
    assert.strictEqual(invoices.length, 2);
    assert.strictEqual(invoices[0].asSource().filename, "invoice_p_0-0.pdf");
    assert.strictEqual(invoices[1].asSource().filename, "invoice_p_1-1.pdf");

    const invoiceResult = await client.parse(
      mindee.v1.product.InvoiceV4, invoices[0].asSource()
    );
    const testStringRstInvoice = await fs.readFile(
      path.join(V1_PRODUCT_PATH, "invoices/response_v4/summary_full_invoice_p1.rst")
    );

    assert.ok(
      levenshteinRatio(
        invoiceResult.document.toString(),
        testStringRstInvoice.toString()
      ) >= 0.90
    );
  }).timeout(60000);
});

describe("MindeeV1 - Integration - InvoiceSplitterV1 #OptionalDepsRemoved", function () {
  let client: mindee.v1.Client;

  beforeEach(() => {
    client = new mindee.v1.Client();
  });

  it("should NOT be able to split invoices", async function () {
    try {
      const sample = new mindee.PathInput({
        inputPath: path.join(V1_PRODUCT_PATH, "invoice_splitter/default_sample.pdf")
      });

      const response = await client.enqueueAndParse(
        mindee.v1.product.InvoiceSplitterV1, sample
      );
      const invoiceSplitterInference = response.document?.inference;
      assert.ok(invoiceSplitterInference instanceof InvoiceSplitterV1);
      await mindee.v1.extraction.extractInvoices(
        sample,
        invoiceSplitterInference as InvoiceSplitterV1
      );
    } catch (error: any) {
      const isModuleNotFound = error.code === "ERR_MODULE_NOT_FOUND";
      const isBinaryMissing = error.message && error.message.includes("Could not load the \"@cantoo/pdf-lib\" module");
      const isOptionalDependencyMissing = error.message &&
        error.message.includes("requires the optional dependency '@cantoo/pdf-lib'");

      if (!isModuleNotFound && !isBinaryMissing && !isOptionalDependencyMissing) {
        throw error;
      }
    }
  }).timeout(60000);
});
