import { describe, it } from "node:test";
import assert from "node:assert";
import { UrlInput } from "@/index.js";
import { Client } from "@/v1/index.js";
import { InvoiceV4 } from "@/v1/product/index.js";
import { beforeEach } from "node:test";

describe("MindeeV1 - Integration - URL Input", { timeout: 80000 }, () => {
  let client: Client;

  beforeEach(() => {
    const apiKey = process.env.MINDEE_API_KEY;
    if (!apiKey) {
      throw new Error("MINDEE_API_KEY environment variable is not set");
    }
    client = new Client({ apiKey });
  });

  it("should send a document from a URL", async () => {
    const url = "https://raw.githubusercontent.com/mindee/client-lib-test-data/" +
      "refs/heads/main/v1/products/invoice_splitter/invoice_5p.pdf";
    const urlInput = new UrlInput({ url: url });
    await urlInput.init();
    const result = await client.parse(InvoiceV4, urlInput);
    assert.strictEqual(typeof result.document.id, "string");
  });

  it("should retrieve and parse a remote file with redirection", async () => {
    const remoteInput = new UrlInput({
      url: "https://github.com/mindee/client-lib-test-data/blob/main/v1/" +
        "products/invoice_splitter/invoice_5p.pdf?raw=true"
    });
    const localInput = await remoteInput.asLocalInputSource();

    assert.strictEqual(localInput.filename, "invoice_5p.pdf");
    const result = await client.parse(InvoiceV4, localInput);
    assert.strictEqual(result.document.nPages, 5);
  });
});
