import { ClassificationField } from "../../src/fields";
import { expect } from "chai";

describe("Test Classification field", () => {
  it("Should create a Classification field", () => {
    const prediction = {
      value: "food",
      confidence: 0.1,
    };
    const classification = new ClassificationField({ prediction });
    expect(classification.value).to.be.equal(prediction.value);
  });

  it("Should create a Classification field with no confidence", () => {
    const prediction = {
      value: "N/A",
    };
    const classification = new ClassificationField({ prediction });
    expect(classification.confidence).to.be.equals(0);
  });
});
