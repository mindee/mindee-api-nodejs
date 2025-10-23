import { DateField } from "../../../../src/parsing/standard";
import { expect } from "chai";

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
      is_computed: true
    };
    const field = new DateField({ prediction });
    expect(field.value).to.be.equal(prediction.value);
    expect(field.dateObject).to.be.deep.equal(new Date(prediction.value));
    expect(field.boundingBox).to.have.deep.members(prediction["polygon"]);
    expect(field.isComputed).to.be.true;
  });
  it("Should create a Date field with N/A value as input", () => {
    const prediction = {
      value: "N/A",
      confidence: 0.1,
    };
    const field = new DateField({ prediction });
    expect(field.value).to.be.equal(undefined);
    expect(field.dateObject).to.be.equal(undefined);
    expect(field.polygon).to.be.empty;
  });
});
