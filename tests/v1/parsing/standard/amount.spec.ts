import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AmountField } from "@/v1/parsing/standard/index.js";

describe("Test AmountField field", () => {
  it("Should create an AmountField field", () => {
    const prediction = {
      value: "2",
      confidence: 0.1,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    const amount = new AmountField({ prediction });
    assert.strictEqual(amount.value, 2);
    assert.strictEqual(amount.confidence, 0.1);
    assert.strictEqual(amount.toString(), "2.00");
  });

  it("Should create an AmountField field with a N/A value as input", () => {
    const prediction = {
      amount: "N/A",
      confidence: 0.1,
    };
    const amount = new AmountField({ prediction });
    assert.strictEqual(amount.value, undefined);
    assert.strictEqual(amount.confidence, 0.0);
    assert.strictEqual(amount.toString(), "");
  });
});
