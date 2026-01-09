import { StringField } from "@/v1/parsing/standard/index.js";
import { expect } from "chai";

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
    expect(field.value).to.be.equal(prediction.value);
    expect(field.rawValue).to.be.undefined;
    expect(field.boundingBox).to.have.deep.members(prediction["polygon"]);
  });

  it("Should create a String field with a Raw Value", () => {
    const prediction = {
      value: "hellow world",
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
    expect(field.value).to.be.equal(prediction.value);
    expect(field.rawValue).to.be.equal(prediction.raw_value);
    expect(field.boundingBox).to.have.deep.members(prediction["polygon"]);
  });
});
