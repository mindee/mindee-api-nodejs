import * as mindee from "../../../src";
import { InvoiceV4 } from "../../../src/product";
import { expect } from "chai";
import { promises as fs } from "fs";
import { createReadStream } from "node:fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../index";

describe("MindeeV1 - File Input Integration Tests", async () => {
  let client: mindee.Client;
  let filePath: string;

  beforeEach(() => {
    client = new mindee.Client();
    filePath = path.join(V1_PRODUCT_PATH, "invoices/default_sample.jpg");
  });

  it("should send a document from a direct path", async () => {
    const pathInput = client.docFromPath(filePath);
    await pathInput.init();
    const result = await client.parse(InvoiceV4, pathInput);
    expect(result.document.id).to.be.a("string");
  }).timeout(60000);

  it("should send a base64 document", async () => {
    const content = await fs.readFile(filePath);
    const base64Content = content.toString("base64");
    const base64Input = client.docFromBase64(base64Content, "testFile.jpg");
    const result = await client.parse(InvoiceV4, base64Input);
    expect(result.document.id).to.be.a("string");
  }).timeout(60000);

  it("should send a document from a readable stream", async () => {
    const fileStream = createReadStream(filePath);
    const chunks: Buffer[] = [];
    for await (const chunk of fileStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const streamInput = client.docFromBuffer(buffer, "testFile.jpg");
    const result = await client.parse(InvoiceV4, streamInput);
    expect(result.document.id).to.be.a("string");
  }).timeout(60000);


  it("should send a document from bytes", async () => {
    const inputBytes = await fs.readFile(filePath);
    const bytesInput = client.docFromBytes(inputBytes, "testFile.jpg");
    const result = await client.parse(InvoiceV4, bytesInput);
    expect(result.document.id).to.be.a("string");
  }).timeout(60000);

  it("should send a document from buffer", async () => {
    const buffer = await fs.readFile(filePath);
    const bufferInput = client.docFromBuffer(buffer, "testFile.jpg");
    await bufferInput.init();
    const result = await client.parse(InvoiceV4, bufferInput);
    expect(result.document.id).to.be.a("string");
  }).timeout(60000);

  it("should send a document from a URL", async () => {
    const url = "https://raw.githubusercontent.com/mindee/client-lib-test-data/" +
      "refs/heads/main/v1/products/invoice_splitter/invoice_5p.pdf";
    const urlInput = client.docFromUrl(url);
    await urlInput.init();
    const result = await client.parse(InvoiceV4, urlInput);
    expect(result.document.id).to.be.a("string");
  }).timeout(60000);
}).timeout(60000);
