import { beforeEach, describe, it } from "node:test";
import assert from "node:assert";
import path from "path";
import { promises as fs } from "fs";
import { createReadStream } from "node:fs";
import { Client } from "@/v1/index.js";
import { InvoiceV4 } from "@/v1/product/index.js";
import { V1_PRODUCT_PATH } from "../../index.js";
import { PathInput, Base64Input, BufferInput, BytesInput } from "@/index.js";

describe("MindeeV1 - Integration - File Input", { timeout: 80000 }, () => {
  let client: Client;
  let filePath: string;

  beforeEach(() => {
    client = new Client();
    filePath = path.join(V1_PRODUCT_PATH, "invoices/default_sample.jpg");
  });

  it("should send a document from a direct path", async () => {
    const pathInput = new PathInput({ inputPath: filePath });
    await pathInput.init();
    const result = await client.parse(InvoiceV4, pathInput);
    assert.strictEqual(typeof result.document.id, "string");
  });

  it("should send a base64 document", async () => {
    const content = await fs.readFile(filePath);
    const base64Content = content.toString("base64");
    const base64Input = new Base64Input({ inputString: base64Content, filename: "testFile.jpg" });
    const result = await client.parse(InvoiceV4, base64Input);
    assert.strictEqual(typeof result.document.id, "string");
  });

  it("should send a document from a readable stream", async () => {
    const fileStream = createReadStream(filePath);
    const chunks: Buffer[] = [];
    for await (const chunk of fileStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const streamInput = new BufferInput({ buffer: buffer, filename: "testFile.jpg" });
    const result = await client.parse(InvoiceV4, streamInput);
    assert.strictEqual(typeof result.document.id, "string");
  });

  it("should send a document from bytes", async () => {
    const inputBytes = await fs.readFile(filePath);
    const bytesInput = new BytesInput({ inputBytes: inputBytes, filename: "testFile.jpg" });
    const result = await client.parse(InvoiceV4, bytesInput);
    assert.strictEqual(typeof result.document.id, "string");
  });

  it("should send a document from buffer", async () => {
    const buffer = await fs.readFile(filePath);
    const bufferInput = new BufferInput({ buffer: buffer, filename: "testFile.jpg" });
    await bufferInput.init();
    const result = await client.parse(InvoiceV4, bufferInput);
    assert.strictEqual(typeof result.document.id, "string");
  });
});
