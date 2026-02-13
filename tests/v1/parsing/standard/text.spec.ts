import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { StringField } from "@/v1/parsing/standard/index.js";
import { BoundingBox } from "@/geometry/index.js";

describe("Test String field", () => {
  it("Should create a String field", () => {
    const prediction = {
      value: "hellow world",
      confidence: 0.1,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    const field = new StringField({ prediction });
    assert.strictEqual(field.value, prediction.value);
    assert.strictEqual(field.rawValue, undefined);
    assert.deepStrictEqual(
      // @ts-expect-error: prediction polygon is not typed
      field.boundingBox, new BoundingBox(...prediction["polygon"])
    );
  });

  it("Should create a String field with a Raw Value", () => {
    const prediction = {
      value: "hellow world",
      /* eslint-disable-next-line @typescript-eslint/naming-convention,camelcase */
      raw_value: "HelLo WorlD",
      confidence: 0.1,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    const field = new StringField({ prediction });
    assert.strictEqual(field.value, prediction.value);
    assert.strictEqual(field.rawValue, prediction.raw_value);
    assert.deepStrictEqual(
      // @ts-expect-error: prediction polygon is not typed
      field.boundingBox, new BoundingBox(...prediction["polygon"])
    );
  });
});
