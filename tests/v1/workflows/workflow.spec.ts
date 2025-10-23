import { expect } from "chai";
import nock from "nock";
import { promises as fs } from "fs";
import path from "path";
import { GeneratedV1 } from "../../../src/product";
import { WorkflowResponse } from "../../../src/parsing/common/workflowResponse";
import { V1_RESOURCE_PATH } from "../../index";

describe("MindeeV1 - Workflow executions", () => {
  it("should deserialize response correctly when sending a document to an execution", async () => {
    const jsonFilePath = path.join(V1_RESOURCE_PATH, "workflows", "success.json");
    const mockResponse = JSON.parse(await fs.readFile(jsonFilePath, "utf-8"));

    nock("https://api.mindee.net")
      .post("/v1/workflows/execute")
      .reply(202, mockResponse);

    const mockedExecution = new WorkflowResponse(
      GeneratedV1,
      mockResponse
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
      const mockResponse = JSON.parse(await fs.readFile(jsonFilePath, "utf-8"));

      nock("https://api.mindee.net")
        .post("/v1/workflows/execute")
        .reply(200, mockResponse);

      const mockedExecution = new WorkflowResponse(
        GeneratedV1,
        mockResponse
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
