import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ClassificationField } from "@/v1/parsing/standard/index.js";

describe("Test Classification field", () => {
  it("Should create a Classification field", () => {
    const prediction = {
      value: "food",
      confidence: 0.1,
    };
    const field = new ClassificationField({ prediction });
    assert.strictEqual(field.value, prediction.value);
  });

  it("Should create a Classification field with no confidence", () => {
    const prediction = {
      value: "N/A",
    };
    const field = new ClassificationField({ prediction });
    assert.strictEqual(field.confidence, 0);
  });
});
