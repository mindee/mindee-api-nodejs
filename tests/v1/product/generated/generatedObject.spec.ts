import assert from "node:assert/strict";
import { GeneratedObjectField } from "@/v1/parsing/generated/index.js";

describe("Generated Object Field", async () => {
  it("should properly format booleans.", async () => {
    const dummyValue = { value: false, toto: true, hello: "false", other: "true" };
    const genObjectField = new GeneratedObjectField({ prediction: dummyValue });
    assert.ok(genObjectField.toto);
    assert.strictEqual(genObjectField.hello, "false");
    assert.strictEqual(genObjectField.other, "true");
    assert.strictEqual(genObjectField.value, false);
  });
});
