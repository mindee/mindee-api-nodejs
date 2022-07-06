import { Orientation } from "../../src/documents/fields";
import { expect } from "chai";

describe("Test Orientation field", () => {
  it("should create an Orientation field", () => {
    const prediction = {
      degrees: 90,
      probability: 0.1,
    };
    const orientation = new Orientation({ prediction });
    expect(orientation.value).to.be.equal(90);
  });

  it("should create an Orientation field with an NaN value", () => {
    const prediction = {
      degrees: "aze",
      probability: 0.1,
    };
    const orientation = new Orientation({ prediction });
    expect(orientation.value).to.be.equal(0);
  });

  it("should create an Orientation field with an incorrect value", () => {
    const prediction = {
      degrees: 255,
      probability: 0.1,
    };
    const orientation = new Orientation({ prediction });
    expect(orientation.value).to.be.equal(0);
  });
});
