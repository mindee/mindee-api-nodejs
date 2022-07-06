import { Amount } from "../../src/documents/fields";
import { expect } from "chai";

describe("Test Amount field", () => {
  it("Should create an Amount field", () => {
    const prediction = {
      amount: "2",
      confidence: 0.1,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    const amount = new Amount({ prediction });
    expect(amount.value).to.be.equal(2);
    expect(amount.confidence).to.be.equal(0.1);
    expect(amount.toString()).to.be.equal("2.0");
  });

  it("Should create an Amount field with a N/A value as input", () => {
    const prediction = {
      amount: "N/A",
      confidence: 0.1,
    };
    const amount = new Amount({ prediction });
    expect(amount.value).to.be.equal(undefined);
    expect(amount.confidence).to.be.equal(0.0);
    expect(amount.toString()).to.be.equal("");
  });
});
