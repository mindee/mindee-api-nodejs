import { DateField } from "../../src/fields";
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
    };
    const date = new DateField({ prediction });
    expect(date.value).to.be.equal(prediction.value);
    expect(date.dateObject).to.be.deep.equal(new Date(prediction.value));
    expect(date.boundingBox).to.have.deep.members(prediction.polygon);
  });
  it("Should create a Date field with N/A value as input", () => {
    const prediction = {
      value: "N/A",
      confidence: 0.1,
    };
    const date = new DateField({ prediction });
    expect(date.value).to.be.equal(undefined);
    expect(date.dateObject).to.be.equal(undefined);
    expect(date.polygon).to.be.empty;
  });
});
