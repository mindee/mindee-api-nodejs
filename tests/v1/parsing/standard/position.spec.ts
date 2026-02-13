import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PositionField } from "@/v1/parsing/standard/index.js";

describe("Test Position field", () => {
  it("Should create a Position field", () => {
    const prediction = {
      /* eslint-disable-next-line @typescript-eslint/naming-convention,camelcase */
      bounding_box: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      polygon: [
        [0.076, 0.18],
        [0.061, 0.129],
        [0.084, 0.131],
        [0.035, 0.061],
        [0.088, 0.041],
        [0.053, 0.018],
        [0.223, 0.021],
        [0.365, 0.016],
        [0.395, 0.008],
        [0.502, 0.006],
        [0.547, 0.014],
        [0.602, 0.006],
        [0.768, 0.014],
        [0.822, 0.004],
        [0.91, 0.004],
        [0.994, 0.004],
        [0.998, 0.014],
        [0.998, 0.994],
        [0.994, 0.998],
        [0.006, 0.998],
        [0.002, 0.895],
        [0.002, 0.277],
        [0.033, 0.246],
        [0.006, 0.246],
      ],
      quadrangle: [
        [0.001, 0.018],
        [0.998, 0.002],
        [0.998, 0.994],
        [0.006, 0.998],
      ],
      rectangle: [
        [-0.002, 0.006],
        [0.996, 0],
        [1.002, 0.992],
        [0.004, 0.998],
      ],
    };
    const field = new PositionField({ prediction, pageId: 0 });
    assert.strictEqual(field.boundingBox.length, 4);
    assert.strictEqual(field.polygon.length, 24);
    assert.strictEqual(field.toString(), "Polygon with 24 points.");
  });
});
