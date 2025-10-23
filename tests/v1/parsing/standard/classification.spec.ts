import { ClassificationField } from "../../../../src/parsing/standard";
import { expect } from "chai";

describe("Test Classification field", () => {
  it("Should create a Classification field", () => {
    const prediction = {
      value: "food",
      confidence: 0.1,
    };
    const field = new ClassificationField({ prediction });
    expect(field.value).to.be.equal(prediction.value);
  });

  it("Should create a Classification field with no confidence", () => {
    const prediction = {
      value: "N/A",
    };
    const field = new ClassificationField({ prediction });
    expect(field.confidence).to.be.equals(0);
  });
});
