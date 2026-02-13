import assert from "node:assert/strict";
import { split } from "@/v2/product/index.js";

describe("MindeeV2 - Split Parameter", () => {
  const modelIdValue = "test-model-id";

  describe("Polling Options", () => {
    it("should provide sensible defaults", () => {

      const paramsInstance = new split.SplitParameters({
        modelId: modelIdValue,
      });
      assert.strictEqual(paramsInstance.modelId, modelIdValue);
      assert.deepStrictEqual(paramsInstance.getValidatedPollingOptions(), {
        delaySec: 1.5,
        initialDelaySec: 2,
        maxRetries: 80
      });
    });
  });

  describe("Invalid Options", () => {
    it("should not set invalid options", () => {

      const paramsInstance = new split.SplitParameters({
        modelId: modelIdValue,
        // @ts-expect-error - rag is not a valid option
        rag: true,
      });
      assert.strictEqual(paramsInstance.modelId, modelIdValue);
      // @ts-expect-error - rag is not a valid option
      assert.strictEqual(paramsInstance.rag, undefined);
    });
  });

});
