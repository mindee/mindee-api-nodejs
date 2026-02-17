import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { split } from "@/v2/product/index.js";

describe("MindeeV2 - Split Parameter", () => {
  const modelIdValue = "test-model-id";

  describe("Polling Options", () => {
    it("should provide sensible defaults", () => {

      const paramsInstance = new split.SplitParameters({
        modelId: modelIdValue,
      });
      assert.strictEqual(paramsInstance.modelId, modelIdValue);
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
