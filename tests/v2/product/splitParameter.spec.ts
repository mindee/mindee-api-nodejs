import { expect } from "chai";
import { split } from "@/v2/product/index.js";

describe("MindeeV2 - Split Parameter", () => {
  const modelIdValue = "test-model-id";

  describe("Polling Options", () => {
    it("should provide sensible defaults", () => {

      const paramsInstance = new split.SplitParameters({
        modelId: modelIdValue,
      });
      expect(paramsInstance.modelId).to.equal(modelIdValue);
      expect(paramsInstance.getValidatedPollingOptions()).to.deep.equal({
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
      expect(paramsInstance.modelId).to.equal(modelIdValue);
      // @ts-expect-error - rag is not a valid option
      expect(paramsInstance.rag).to.be.undefined;
    });
  });

});
