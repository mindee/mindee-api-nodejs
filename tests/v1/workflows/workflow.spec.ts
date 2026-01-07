import { expect } from "chai";
import nock from "nock";
import { promises as fs } from "fs";
import path from "path";
import { RESOURCE_PATH, V1_RESOURCE_PATH } from "../../index.js";
import { Client, PathInput } from "@/index.js";


async function setNockInterceptor(httpCode: number, jsonFilePath: string) {
  const mockResponse = JSON.parse(await fs.readFile(jsonFilePath, "utf-8"));
  nock("https://v1-dummy-host")
    .post(/v1\/workflows\/.*/)
    .reply(httpCode, mockResponse);
}

async function executeWorkflow(doc: PathInput, workflowId: string) {
  const client = new Client({ apiKey: "my-api-key", debug: true });
  return await client.executeWorkflow(doc, workflowId);
}

describe("MindeeV1 - Workflow executions", () => {
  const doc = new PathInput({
    inputPath: path.join(RESOURCE_PATH, "file_types/pdf/blank_1.pdf")
  });

  beforeEach(function() {
    process.env.MINDEE_API_HOST = "v1-dummy-host";
  });

  afterEach(function() {
    delete process.env.MINDEE_API_HOST;
  });

  it("should deserialize response correctly when sending a document to an execution", async () => {
    const jsonFilePath = path.join(V1_RESOURCE_PATH, "workflows", "success.json");
    await setNockInterceptor(202, jsonFilePath);
    const mockedExecution = await executeWorkflow(
      doc, "07ebf237-ff27-4eee-b6a2-425df4a5cca6"
    );
    expect(mockedExecution).to.not.be.null;
    expect(mockedExecution.apiRequest).to.not.be.null;
    expect(mockedExecution.execution.batchName).to.be.null;
    expect(mockedExecution.execution.createdAt).to.be.null;
    expect(mockedExecution.execution.file.alias).to.be.null;
    expect(mockedExecution.execution.file.name).to.equal("default_sample.jpg");
    expect(mockedExecution.execution.id).to.equal("8c75c035-e083-4e77-ba3b-7c3598bd1d8a");
    expect(mockedExecution.execution.inference).to.be.null;
    expect(mockedExecution.execution.priority).to.equal("medium");
    expect(mockedExecution.execution.reviewedAt).to.be.null;
    expect(mockedExecution.execution.reviewedPrediction).to.be.null;
    expect(mockedExecution.execution.status).to.equal("processing");
    expect(mockedExecution.execution.type).to.equal("manual");
    expect(mockedExecution.execution.uploadedAt?.toISOString()).to.equal("2024-11-13T13:02:31.699Z");
    expect(mockedExecution.execution.workflowId).to.equal("07ebf237-ff27-4eee-b6a2-425df4a5cca6");
  });

  it("should deserialize response correctly when sending a document to an execution with priority and alias",
    async () => {
      const jsonFilePath = path.join(V1_RESOURCE_PATH, "workflows", "success_low_priority.json");
      await setNockInterceptor(200, jsonFilePath);
      const mockedExecution = await executeWorkflow(
        doc, "07ebf237-ff27-4eee-b6a2-425df4a5cca6"
      );
      expect(mockedExecution).to.not.be.null;
      expect(mockedExecution.apiRequest).to.not.be.null;
      expect(mockedExecution.execution.batchName).to.be.null;
      expect(mockedExecution.execution.createdAt).to.be.null;
      expect(mockedExecution.execution.file.alias).to.equal("low-priority-sample-test");
      expect(mockedExecution.execution.file.name).to.equal("default_sample.jpg");
      expect(mockedExecution.execution.id).to.equal("b743e123-e18c-4b62-8a07-811a4f72afd3");
      expect(mockedExecution.execution.inference).to.be.null;
      expect(mockedExecution.execution.priority).to.equal("low");
      expect(mockedExecution.execution.reviewedAt).to.be.null;
      expect(mockedExecution.execution.reviewedPrediction).to.be.null;
      expect(mockedExecution.execution.status).to.equal("processing");
      expect(mockedExecution.execution.type).to.equal("manual");
      expect(mockedExecution.execution.uploadedAt?.toISOString()).to.equal("2024-11-13T13:17:01.315Z");
      expect(mockedExecution.execution.workflowId).to.equal("07ebf237-ff27-4eee-b6a2-425df4a5cca6");
    });
});
