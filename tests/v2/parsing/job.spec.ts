import assert from "node:assert/strict";
import path from "node:path";
import {
  JobResponse,
  LocalResponse,
  ErrorResponse,
} from "@/v2/index.js";
import { V2_RESOURCE_PATH } from "../../index.js";

const jobPath = path.join(V2_RESOURCE_PATH, "job");

async function loadV2Job(resourcePath: string): Promise<JobResponse> {
  const localResponse = new LocalResponse(resourcePath);
  await localResponse.init();
  return localResponse.deserializeResponse(JobResponse);
}

describe("MindeeV2 - Job Response", async () => {
  describe("OK", async () => {
    it("should load when status is Processing", async () => {
      const response = await loadV2Job(
        path.join(jobPath, "ok_processing.json")
      );
      assert.ok(response.job);
      assert.strictEqual(response.job.error, undefined);
    });
  });
  describe("Fail", async () => {
    it("should load with 422 error", async () => {
      const response = await loadV2Job(
        path.join(jobPath, "fail_422.json")
      );
      assert.ok(response.job);
      assert.ok(response.job.error instanceof ErrorResponse);
      assert.strictEqual(response.job.error?.status, 422);
      assert.ok(response.job.error?.code.startsWith("422-"));
      assert.ok(Array.isArray(response.job.error?.errors));
    });
  });
});
