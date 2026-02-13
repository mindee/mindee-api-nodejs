import * as mindee from "@/index.js";
import { ExecutionPriority } from "@/v1/parsing/common/index.js";
import assert from "node:assert";
import { LocalInputSource } from "@/input/index.js";
import { OptionalAsyncOptions } from "@/v1/index.js";
import { FinancialDocumentV1 } from "@/v1/product/index.js";
import { RAGExtra } from "@/v1/parsing/common/extras/ragExtra.js";
import path from "path";
import { V1_PRODUCT_PATH } from "../../index.js";

describe("MindeeV1 - Workflow calls", () => {
  let client: mindee.v1.Client;
  let sample: LocalInputSource;
  let workflowId: string;

  beforeEach(async () => {
    client = new mindee.v1.Client();
    workflowId = process.env["WORKFLOW_ID"] ?? "";
    sample = new mindee.PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "financial_document/default_sample.jpg")
    });
    await sample.init();
  });

  it("should retrieve a correct response from the API.", async () => {
    const currentDateTime = new Date()
      .toISOString()
      .replace(/T/, "-")
      .replace(/\..+/, "");
    const response = await client.executeWorkflow(
      sample,
      workflowId,
      { alias: `node-${currentDateTime}`, priority: ExecutionPriority.low, rag: true });
    assert.strictEqual(response.execution.priority, ExecutionPriority.low);
    assert.strictEqual(response.execution.file.alias, `node-${currentDateTime}`);
  }).timeout(60000);

  it("should poll with RAG disabled", async () => {
    const asyncParams: OptionalAsyncOptions = {
      workflowId: workflowId
    };
    const response = await client.enqueueAndParse(
      FinancialDocumentV1,
      sample,
      asyncParams
    );
    assert.ok(response.document?.toString());
    assert.strictEqual(response.document?.inference.extras?.rag, undefined);
  }).timeout(60000);

  it("should poll with RAG disabled and OCR words", async () => {
    const asyncParams: OptionalAsyncOptions = {
      workflowId: workflowId,
      allWords: true
    };
    const response = await client.enqueueAndParse(
      FinancialDocumentV1,
      sample,
      asyncParams
    );
    assert.ok(response.document?.toString());
    assert.strictEqual(response.document?.inference.extras?.rag, undefined);
    assert.ok(response.document?.ocr);
    assert.ok(response.document?.ocr?.toString());
  }).timeout(60000);

  it("should poll with RAG enabled", async () => {
    const asyncParams: OptionalAsyncOptions = {
      workflowId: workflowId,
      rag: true
    };
    const response = await client.enqueueAndParse(
      FinancialDocumentV1,
      sample,
      asyncParams
    );

    assert.ok(response.document?.toString());
    assert.ok(((response.document?.inference.extras?.rag) as RAGExtra).matchingDocumentId);
  }).timeout(60000);

  it("should poll with RAG enabled and OCR words", async () => {
    const asyncParams: OptionalAsyncOptions = {
      workflowId: workflowId,
      rag: true,
      allWords: true
    };
    const response = await client.enqueueAndParse(
      FinancialDocumentV1,
      sample,
      asyncParams
    );
    assert.ok(response.document?.toString());
    assert.ok(((response.document?.inference.extras?.rag) as RAGExtra).matchingDocumentId);
    assert.ok(response.document?.ocr);
    assert.ok(response.document?.ocr?.toString());
  }).timeout(60000);
});
