import { JobResponse, LocalResponse } from "@/index.js";
import path from "node:path";
import { V2_RESOURCE_PATH } from "../../index.js";
import { expect } from "chai";
import { ErrorResponse } from "@/parsing/v2/index.js";

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
      expect(response.job).to.be.not.empty;
      expect(response.job.error).to.be.undefined;
    });
  });
  describe("Fail", async () => {
    it("should load with 422 error", async () => {
      const response = await loadV2Job(
        path.join(jobPath, "fail_422.json")
      );
      expect(response.job).to.be.not.empty;
      expect(response.job.error).to.be.instanceOf(ErrorResponse);
      expect(response.job.error?.status).to.eq(422);
      expect(response.job.error?.code.startsWith("422-")).to.be.true;
      expect(response.job.error?.errors).to.be.instanceOf(Array);
    });
  });
});
