import * as mindee from "@/index.js";
import { ExecutionPriority } from "@/v1/parsing/common/index.js";
import { expect } from "chai";
import { LocalInputSource } from "@/input/index.js";
import { OptionalAsyncOptions } from "@/client.js";
import { FinancialDocumentV1 } from "@/v1/product/index.js";
import { RAGExtra } from "@/v1/parsing/common/extras/ragExtra.js";
import path from "path";
import { V1_PRODUCT_PATH } from "../../index.js";

describe("MindeeV1 - Workflow calls", () => {
  let client: mindee.Client;
  let sample: LocalInputSource;
  let workflowId: string;

  beforeEach(async () => {
    client = new mindee.Client();
    workflowId = process.env["WORKFLOW_ID"] ?? "";
    sample = new mindee.PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "financial_document/default_sample.jpg")
    });
    await sample.init();
  });

  it("should retrieve a correct response from the API.", async () => {
    const currentDateTime = new Date().toISOString().replace(/T/, "-").replace(/\..+/, "");
    const response = await client.executeWorkflow(
      sample,
      workflowId,
      { alias: `node-${currentDateTime}`, priority: ExecutionPriority.low, rag: true });
    expect(response.execution.priority).to.equal(ExecutionPriority.low);
    expect(response.execution.file.alias).to.equal(`node-${currentDateTime}`);
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
    expect(response.document?.toString()).to.not.be.empty;
    expect(response.document?.inference.extras?.rag).to.be.undefined;
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
    expect(response.document?.toString()).to.not.be.empty;
    expect(response.document?.inference.extras?.rag).to.be.undefined;
    expect(response.document?.ocr).to.exist;
    expect(response.document?.ocr?.toString()).to.not.be.empty;
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

    expect(response.document?.toString()).to.not.be.empty;
    expect(((response.document?.inference.extras?.rag) as RAGExtra).matchingDocumentId).to.not.be.empty;
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
    expect(response.document?.toString()).to.not.be.empty;
    expect(((response.document?.inference.extras?.rag) as RAGExtra).matchingDocumentId).to.not.be.empty;
    expect(response.document?.ocr).to.exist;
    expect(response.document?.ocr?.toString()).to.not.be.empty;
  }).timeout(60000);
});
