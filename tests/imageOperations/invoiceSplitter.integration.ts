import * as mindee from "../../src/";
import { InvoiceSplitterV1 } from "../../src/product";
import { expect } from "chai";
import { levenshteinRatio } from "../testingUtilities";
import { promises as fs } from "fs";
import path from "path";

describe("Given a PDF", async () => {
  let client: mindee.Client;

  beforeEach(() => {
    client = new mindee.Client();
  });

  it("should extract invoices in strict mode.", async () => {
    const sample = client.docFromPath(
      "tests/data/products/invoice_splitter/default_sample.pdf"
    );
    await sample.init();

    const response = await client.enqueueAndParse(mindee.product.InvoiceSplitterV1, sample);
    const invoiceSplitterInference = response.document?.inference;
    expect(invoiceSplitterInference).to.be.an.instanceof(InvoiceSplitterV1);
    const invoices = await mindee.imageOperations.extractInvoices(
      sample,
      invoiceSplitterInference as InvoiceSplitterV1
    );
    expect(invoices.length).to.be.eq(2);
    expect(invoices[0].asSource().filename).to.eq("invoice_p_0-0.pdf");
    expect(invoices[1].asSource().filename).to.eq("invoice_p_1-1.pdf");

    const invoiceResult = await client.parse(mindee.product.InvoiceV4, invoices[0].asSource());
    const testStringRstInvoice = await fs.readFile(
      path.join("tests/data/products/invoices/response_v4/summary_full_invoice_p1.rst")
    );

    expect(
      levenshteinRatio(
        invoiceResult.document.toString(),
        testStringRstInvoice.toString()
      )
    ).to.be.greaterThanOrEqual(0.97);
  }).timeout(60000);
});
