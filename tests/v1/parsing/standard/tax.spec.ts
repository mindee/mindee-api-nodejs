import { TaxField } from "@/v1/parsing/standard/index.js";
import assert from "node:assert/strict";

describe("Test Tax field", () => {
  it("should create a Tax field", () => {
    const prediction = {
      value: "2",
      rate: 0.2,
      code: "QST",
      confidence: 0.1,
      base: 5,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    const tax = new TaxField({ prediction, valueKey: "value" });
    assert.strictEqual(tax.value, 2);
    assert.strictEqual(tax.confidence, 0.1);
    assert.strictEqual(tax.rate, 0.2);
    assert.strictEqual(tax.boundingBox.length, 4);
    assert.strictEqual(tax.toString(), "Base: 5.00, Code: QST, Rate (%): 0.20, Amount: 2.00");
  });

  it("should create a Tax with rate not valid", () => {
    const prediction = {
      value: 2,
      rate: "aa",
      confidence: 0.1,
    };
    const tax = new TaxField({ prediction });
    assert.strictEqual(tax.rate, undefined);
    assert.strictEqual(tax.polygon.length, 0);
    assert.strictEqual(tax.toString(), "Base: , Code: , Rate (%): , Amount: 2.00");
  });

  it("should create a Tax with amount not valid", () => {
    const prediction = {
      value: "NA",
      rate: "AA",
      code: "N/A",
      confidence: 0.1,
    };
    const tax = new TaxField({ prediction });
    assert.strictEqual(tax.value, undefined);
    assert.strictEqual(tax.toString(), "Base: , Code: , Rate (%): , Amount:");
  });
});
