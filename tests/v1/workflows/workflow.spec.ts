import assert from "node:assert";
import { MockAgent, setGlobalDispatcher } from "undici";
import { promises as fs } from "fs";
import path from "path";
import { RESOURCE_PATH, V1_RESOURCE_PATH } from "../../index.js";
import { Client } from "@/v1/index.js";
import { PathInput } from "@/index.js";

const mockAgent = new MockAgent();
setGlobalDispatcher(mockAgent);
const mockPool = mockAgent.get("https://v1-workflow-host");

async function setInterceptor(httpCode: number, jsonFilePath: string) {
  const mockResponse = JSON.parse(await fs.readFile(jsonFilePath, "utf-8"));
  mockPool
    .intercept({ path: /v1\/workflows\/.*/, method: "POST" })
    .reply(httpCode, mockResponse);
}

async function executeWorkflow(doc: PathInput, workflowId: string) {
  const client = new Client({ apiKey: "my-api-key", debug: true, dispatcher: mockAgent });
  return await client.executeWorkflow(doc, workflowId);
}

describe("MindeeV1 - Workflow executions", () => {
  const doc = new PathInput({
    inputPath: path.join(RESOURCE_PATH, "file_types/pdf/blank_1.pdf")
  });

  beforeEach(function() {
    process.env.MINDEE_API_HOST = "v1-workflow-host";
  });

  afterEach(function() {
    delete process.env.MINDEE_API_HOST;
  });

  it("should deserialize response correctly when sending a document to an execution", async () => {
    const jsonFilePath = path.join(V1_RESOURCE_PATH, "workflows", "success.json");
    await setInterceptor(202, jsonFilePath);
    const mockedExecution = await executeWorkflow(
      doc, "07ebf237-ff27-4eee-b6a2-425df4a5cca6"
    );
    assert.notStrictEqual(mockedExecution, null);
    assert.notStrictEqual(mockedExecution.apiRequest, null);
    assert.strictEqual(mockedExecution.execution.batchName, null);
    assert.strictEqual(mockedExecution.execution.createdAt, null);
    assert.strictEqual(mockedExecution.execution.file.alias, null);
    assert.strictEqual(mockedExecution.execution.file.name, "default_sample.jpg");
    assert.strictEqual(mockedExecution.execution.id, "8c75c035-e083-4e77-ba3b-7c3598bd1d8a");
    assert.strictEqual(mockedExecution.execution.inference, null);
    assert.strictEqual(mockedExecution.execution.priority, "medium");
    assert.strictEqual(mockedExecution.execution.reviewedAt, null);
    assert.strictEqual(mockedExecution.execution.reviewedPrediction, null);
    assert.strictEqual(mockedExecution.execution.status, "processing");
    assert.strictEqual(mockedExecution.execution.type, "manual");
    assert.strictEqual(mockedExecution.execution.uploadedAt?.toISOString(), "2024-11-13T13:02:31.699Z");
    assert.strictEqual(mockedExecution.execution.workflowId, "07ebf237-ff27-4eee-b6a2-425df4a5cca6");
  });

  it("should deserialize response correctly when sending a document to an execution with priority and alias",
    async () => {
      const jsonFilePath = path.join(V1_RESOURCE_PATH, "workflows", "success_low_priority.json");
      await setInterceptor(200, jsonFilePath);
      const mockedExecution = await executeWorkflow(
        doc, "07ebf237-ff27-4eee-b6a2-425df4a5cca6"
      );
      assert.notStrictEqual(mockedExecution, null);
      assert.notStrictEqual(mockedExecution.apiRequest, null);
      assert.strictEqual(mockedExecution.execution.batchName, null);
      assert.strictEqual(mockedExecution.execution.createdAt, null);
      assert.strictEqual(mockedExecution.execution.file.alias, "low-priority-sample-test");
      assert.strictEqual(mockedExecution.execution.file.name, "default_sample.jpg");
      assert.strictEqual(mockedExecution.execution.id, "b743e123-e18c-4b62-8a07-811a4f72afd3");
      assert.strictEqual(mockedExecution.execution.inference, null);
      assert.strictEqual(mockedExecution.execution.priority, "low");
      assert.strictEqual(mockedExecution.execution.reviewedAt, null);
      assert.strictEqual(mockedExecution.execution.reviewedPrediction, null);
      assert.strictEqual(mockedExecution.execution.status, "processing");
      assert.strictEqual(mockedExecution.execution.type, "manual");
      assert.strictEqual(mockedExecution.execution.uploadedAt?.toISOString(), "2024-11-13T13:17:01.315Z");
      assert.strictEqual(mockedExecution.execution.workflowId, "07ebf237-ff27-4eee-b6a2-425df4a5cca6");
    });
});
