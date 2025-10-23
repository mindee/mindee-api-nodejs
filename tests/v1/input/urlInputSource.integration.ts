import { expect } from "chai";
import { UrlInput } from "../../../src";
import { Client } from "../../../src";
import { InvoiceV4 } from "../../../src/product";

describe("MindeeV1 - URL Input Integration Test", async () => {
  it("should retrieve and parse a remote file", async () => {
    const apiKey = process.env.MINDEE_API_KEY;
    if (!apiKey) {
      throw new Error("MINDEE_API_KEY environment variable is not set");
    }
    const client = new Client({ apiKey });
    const remoteInput = new UrlInput({
      url: "https://github.com/mindee/client-lib-test-data/blob/main/products/invoice_splitter/invoice_5p.pdf?raw=true"
    });
    await remoteInput.init();
    const localInput = await remoteInput.asLocalInputSource();

    expect(localInput.filename).to.equal("invoice_5p.pdf");
    const result = await client.parse(InvoiceV4, localInput);
    expect(result.document.nPages).to.equal(5);
  }).timeout(60000);
});
