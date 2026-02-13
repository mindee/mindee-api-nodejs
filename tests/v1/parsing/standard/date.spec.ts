import { DateField } from "@/v1/parsing/standard/index.js";
import assert from "node:assert/strict";
import { BoundingBox } from "@/geometry/index.js";

describe("Test Date field", () => {
  it("Should create a Date field", () => {
    const prediction = {
      value: "2018-04-01",
      confidence: 0.1,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
      // eslint-disable-next-line @typescript-eslint/naming-convention,camelcase
      is_computed: true
    };
    const field = new DateField({ prediction });
    assert.strictEqual(field.value, prediction.value);
    assert.deepStrictEqual(field.dateObject, new Date(prediction.value));
    assert.deepStrictEqual(
      // @ts-expect-error: prediction polygon is not typed
      field.boundingBox, new BoundingBox(...prediction["polygon"])
    );
    assert.ok(field.isComputed);
  });
  it("Should create a Date field with N/A value as input", () => {
    const prediction = {
      value: "N/A",
      confidence: 0.1,
    };
    const field = new DateField({ prediction });
    assert.strictEqual(field.value, undefined);
    assert.strictEqual(field.dateObject, undefined);
    assert.strictEqual(field.polygon.length, 0);
  });
});
