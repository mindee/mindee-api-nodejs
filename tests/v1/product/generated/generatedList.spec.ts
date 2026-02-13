import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GeneratedListField } from "@/v1/parsing/generated/index.js";

describe("Generated List Field Objects", async () => {
  it("should properly format floats.", async () => {
    const dummyValue = [{ value: "123.40" }, { value: 567.8 }];
    const genListField = new GeneratedListField({ prediction: dummyValue });
    assert.strictEqual((genListField.values[0] as any).value, "123.40");
    assert.strictEqual((genListField.values[1] as any).value, "567.8");
  });
});
