import { OrientationField } from "../../../src/parsing/common";
import { expect } from "chai";

describe("Test Orientation field", () => {
  it("should create an Orientation field", () => {
    const prediction = {
      value: 90,
    };
    const orientation = new OrientationField({ prediction, pageId: 0 });
    expect(orientation.value).to.be.equal(90);
  });

  it("should create an Orientation field with an NaN value", () => {
    const prediction = {
      value: "aze",
    };
    const orientation = new OrientationField({ prediction, pageId: 0 });
    expect(orientation.value).to.be.equal(0);
  });

  it("should create an Orientation field with an incorrect value", () => {
    const prediction = {
      value: 255,
    };
    const orientation = new OrientationField({ prediction, pageId: 0 });
    expect(orientation.value).to.be.equal(0);
  });
});
