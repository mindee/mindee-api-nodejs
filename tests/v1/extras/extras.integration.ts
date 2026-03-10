import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import * as mindee from "@/index.js";
import path from "path";
import { V1_PRODUCT_PATH } from "../../index.js";


describe("MindeeV1 - Integration - Extras", { timeout: 70000 }, () => {
  let client: mindee.v1.Client;

  beforeEach(() => {
    client = new mindee.v1.Client();
  });

  it("should send cropper extra", async () => {
    const sample = new mindee.PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "invoices/default_sample.jpg")
    });
    await sample.init();
    const response = await client.parse(
      mindee.v1.product.InvoiceV4, sample, { cropper: true }
    );
    assert.ok(response.document.inference.pages[0]?.extras?.cropper);
  });

  it("should send full text OCR extra", async () => {
    const sample = new mindee.PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "international_id/default_sample.jpg")
    });
    await sample.init();
    const response = await client.enqueueAndParse(
      mindee.v1.product.InternationalIdV2, sample, { fullText: true }
    );
    assert.ok(response.document?.extras?.fullTextOcr);
  });

  it("should send OCR words synchronously", async () => {
    const sample = new mindee.PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "financial_document/default_sample.jpg")
    });
    await sample.init();
    const response = await client.parse(
      mindee.v1.product.FinancialDocumentV1, sample, { allWords: true }
    );
    assert.ok(response.document?.ocr);
    assert.ok(response.document?.ocr?.toString());
  });

  it("should send OCR words asynchronously", async () => {
    const sample = new mindee.PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "financial_document/default_sample.jpg")
    });
    await sample.init();
    const response = await client.enqueueAndParse(
      mindee.v1.product.FinancialDocumentV1, sample, { allWords: true }
    );
    assert.ok(response.document?.ocr);
    assert.ok(response.document?.ocr?.toString());
  });
});
