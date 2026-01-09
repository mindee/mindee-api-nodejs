import * as mindee from "@/index.js";
import { InvoiceSplitterV1 } from "@/v1/product/index.js";
import { expect } from "chai";
import { levenshteinRatio } from "../../../testingUtilities";
import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../index.js";

describe("MindeeV1 - InvoiceSplitterV1 Integration Tests", async () => {
  let client: mindee.Client;

  beforeEach(() => {
    client = new mindee.Client();
  });

  it("should extract invoices in strict mode.", async () => {
    const sample = new mindee.PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "invoice_splitter/default_sample.pdf")
    });

    const response = await client.enqueueAndParse(
      mindee.product.InvoiceSplitterV1, sample
    );
    const invoiceSplitterInference = response.document?.inference;
    expect(invoiceSplitterInference).to.be.an.instanceof(InvoiceSplitterV1);
    const invoices = await mindee.imageOperations.extractInvoices(
      sample,
      invoiceSplitterInference as InvoiceSplitterV1
    );
    expect(invoices.length).to.be.eq(2);
    expect(invoices[0].asSource().filename).to.eq("invoice_p_0-0.pdf");
    expect(invoices[1].asSource().filename).to.eq("invoice_p_1-1.pdf");

    const invoiceResult = await client.parse(
      mindee.product.InvoiceV4, invoices[0].asSource()
    );
    const testStringRstInvoice = await fs.readFile(
      path.join(V1_PRODUCT_PATH, "invoices/response_v4/summary_full_invoice_p1.rst")
    );

    expect(
      levenshteinRatio(
        invoiceResult.document.toString(),
        testStringRstInvoice.toString()
      )
    ).to.be.greaterThanOrEqual(0.90);
  }).timeout(60000);
});
