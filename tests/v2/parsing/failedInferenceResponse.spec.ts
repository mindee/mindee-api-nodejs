import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "node:path";
import { ErrorResponse, LocalResponse, FailedInferenceResponse } from "@/v2/index.js";
import { V2_RESOURCE_PATH } from "../../index.js";

describe("MindeeV2 - Failed Inference Response", async () => {

  it("should load from a JSON file", async () => {

    const localResponse = new LocalResponse(path.join(V2_RESOURCE_PATH, "errors", "webhook_error_500_failed.json"));
    await localResponse.init();
    const response = await localResponse.deserializeResponse(FailedInferenceResponse);

    assert.ok(response);
    assert.equal(response.inferenceId, "12345678-1234-1234-1234-123456789ABC");
    assert.equal(response.fileName, "default_sample.jpg");
    assert.equal(response.fileAlias, "dummy-alias.jpg");
    assert.ok(response.createdAt);
    assert.ok(response.createdAt instanceof Date);
    assert.ok(response.error instanceof ErrorResponse);
    assert.equal(response.error.status, 500);
    assert.equal(response.error.code, "500-012");
  });
});
