import { expect } from "chai";
import * as mindee from "@/index.js";
import path from "path";
import { V1_PRODUCT_PATH } from "../../index.js";


describe("MindeeV1 - Extras Integration Tests", async () => {
  let client: mindee.Client;

  beforeEach(() => {
    client = new mindee.Client();
  });

  it("should send cropper extra", async () => {
    const sample = new mindee.PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "invoices/default_sample.jpg")
    });
    await sample.init();
    const response = await client.parse(
      mindee.product.InvoiceV4, sample, { cropper: true }
    );
    expect(response.document.inference.pages[0]?.extras?.cropper).to.exist;
  }).timeout(60000);

  it("should send full text OCR extra", async () => {
    const sample = new mindee.PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "international_id/default_sample.jpg")
    });
    await sample.init();
    const response = await client.enqueueAndParse(
      mindee.product.InternationalIdV2, sample, { fullText: true }
    );
    expect(response.document?.extras?.fullTextOcr).to.exist;

  }).timeout(60000);

  it("should send OCR words synchronously", async () => {
    const sample = new mindee.PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "financial_document/default_sample.jpg")
    });
    await sample.init();
    const response = await client.parse(
      mindee.product.FinancialDocumentV1, sample, { allWords: true }
    );
    expect(response.document?.ocr).to.exist;
    expect(response.document?.ocr?.toString()).to.not.be.empty;

  }).timeout(65000);

  it("should send OCR words asynchronously", async () => {
    const sample = new mindee.PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "financial_document/default_sample.jpg")
    });
    await sample.init();
    const response = await client.enqueueAndParse(
      mindee.product.FinancialDocumentV1, sample, { allWords: true }
    );
    expect(response.document?.ocr).to.exist;
    expect(response.document?.ocr?.toString()).to.not.be.empty;

  }).timeout(65000);
});
