import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Field } from "@/v1/parsing/standard/index.js";

describe("Test different inits of Field", () => {
  it("Should create a Field", () => {
    const prediction = {
      value: "test",
      confidence: 0.1,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    const field = new Field({ prediction });
    assert.strictEqual(field.value, "test");
    assert.strictEqual(field.confidence, 0.1);
    assert.ok(field.boundingBox.length > 0);
  });

  it("should not fail if no polygon given", () => {
    const prediction = {
      value: "test",
      confidence: 0.1,
    };
    const field = new Field({ prediction });
    assert.strictEqual(field.polygon.length, 0);
  });

  it("should be equal to itself only", () => {
    const prediction1 = {
      value: "test",
      confidence: 0.1,
    };
    const prediction2 = {
      value: "other",
      confidence: 0.1,
    };
    const field1 = new Field({ prediction: prediction1 });
    const field2 = new Field({ prediction: prediction2 });
    assert.ok(field1.compare(field1));
    assert.ok(!field1.compare(field2));
  });

  it("should create with an N/A value", () => {
    const prediction = {
      value: null,
    };
    const field = new Field({ prediction });
    assert.strictEqual(field.value, undefined);
    assert.strictEqual(field.confidence, 0.0);
  });

  it("should manipulate multiple fields", () => {
    const fields = [
      new Field({ prediction: { value: 1, confidence: 0.1 } }),
      new Field({ prediction: { value: 2, confidence: 0.8 } }),
    ];
    assert.strictEqual(Field.arrayConfidence(fields), 0.8 * 0.1);
    assert.strictEqual(Field.arraySum(fields), 3);
    const fields2 = [
      new Field({ prediction: { value: undefined, confidence: undefined } }),
      new Field({ prediction: { value: 4, confidence: 0.8 } }),
    ];
    assert.strictEqual(Field.arrayConfidence(fields2), 0.0);
    assert.strictEqual(Field.arraySum(fields2), 0.0);
  });
});
