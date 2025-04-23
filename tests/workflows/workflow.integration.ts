import * as mindee from "../../src";
import { ExecutionPriority } from "../../src/parsing/common";
import { expect } from "chai";
import { LocalInputSource } from "../../src/input";
import { OptionalAsyncOptions } from "../../src/client";
import { FinancialDocumentV1 } from "../../src/product";
import { RAGExtra } from "../../src/parsing/common/extras/ragExtra";

describe("Workflow calls", () => {
  let client: mindee.Client;
  let sample: LocalInputSource;
  beforeEach(async () => {
    client = new mindee.Client();
    sample = client.docFromPath(
      "tests/data/products/financial_document/default_sample.jpg"
    );
    await sample.init();
  });
  it("should retrieve a correct response from the API.", async () => {
    const currentDateTime = new Date().toISOString().replace(/T/, "-").replace(/\..+/, "");
    const response = await client.executeWorkflow(
      sample,
      process.env["WORKFLOW_ID"] ?? "",
      { alias: `node-${currentDateTime}`, priority: ExecutionPriority.low, rag: true });
    expect(response.execution.priority).to.equal(ExecutionPriority.low);
    expect(response.execution.file.alias).to.equal(`node-${currentDateTime}`);
  }).timeout(60000);

  it("should poll with rag enabled", async () => {
    const asyncParams: OptionalAsyncOptions = {
      rag: true,
      workflowId: process.env["WORKFLOW_ID"] ?? undefined
    };
    const response = await client.enqueueAndParse(
      FinancialDocumentV1,
      sample,
      asyncParams
    );

    expect(response.document?.toString()).to.not.be.empty;
    expect(((response.document?.inference.extras?.rag) as RAGExtra).matchingDocumentId).to.not.be.empty;
  }).timeout(60000);

  it("should poll with rag disabled", async () => {
    const asyncParams: OptionalAsyncOptions = {
      workflowId: process.env["WORKFLOW_ID"] ?? undefined
    };
    const response = await client.enqueueAndParse(
      FinancialDocumentV1,
      sample,
      asyncParams
    );

    expect(response.document?.toString()).to.not.be.empty;
    expect(response.document?.inference.extras?.rag).to.be.undefined;
  }).timeout(60000);
});
