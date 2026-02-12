import * as mindee from "@/index.js";
import { InvoiceSplitterV1 } from "@/v1/product/index.js";
import { expect } from "chai";
import path from "path";
import { V1_PRODUCT_PATH } from "../index.js";

describe("Light Environment Sanity Check #lightDeps", function () {
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
      expect(invoiceSplitterInference).to.be.an.instanceof(InvoiceSplitterV1);
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
