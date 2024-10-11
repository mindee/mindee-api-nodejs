import { expect } from "chai";
import * as mindee from "../../src/";



describe("Mindee Client Integration Tests", async () => {
  let client: mindee.Client;

  beforeEach(() => {
    client = new mindee.Client();
  });

  it("should send cropper extra", async () => {
    const sample = client.docFromPath(
      "tests/data/products/invoices/default_sample.jpg"
    );
    await sample.init();
    const response = await client.parse(mindee.product.InvoiceV4, sample, { cropper: true });
    expect(response.document.inference.pages[0]?.extras?.cropper).to.exist;
  }).timeout(60000);

  it("should send full text OCR extra", async () => {
    const sample = client.docFromPath(
      "tests/data/products/international_id/default_sample.jpg"
    );
    await sample.init();
    const response = await client.enqueueAndParse(mindee.product.InternationalIdV2, sample, { fullText: true });
    expect(response.document?.extras?.fullTextOcr).to.exist;

  }).timeout(60000);
});
