import { OrientationField } from "@/v1/parsing/common/index.js";
import assert from "node:assert/strict";

describe("Test Orientation field", () => {
  it("should create an Orientation field", () => {
    const prediction = {
      value: 90,
    };
    const orientation = new OrientationField({ prediction, pageId: 0 });
    assert.strictEqual(orientation.value, 90);
  });

  it("should create an Orientation field with an NaN value", () => {
    const prediction = {
      value: "aze",
    };
    const orientation = new OrientationField({ prediction, pageId: 0 });
    assert.strictEqual(orientation.value, 0);
  });

  it("should create an Orientation field with an incorrect value", () => {
    const prediction = {
      value: 255,
    };
    const orientation = new OrientationField({ prediction, pageId: 0 });
    assert.strictEqual(orientation.value, 0);
  });
});
