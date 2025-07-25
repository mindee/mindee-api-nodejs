import { AmountField } from "../../../src/parsing/standard";
import { expect } from "chai";

describe("Test AmountField field", () => {
  it("Should create an AmountField field", () => {
    const prediction = {
      value: "2",
      confidence: 0.1,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    const amount = new AmountField({ prediction });
    expect(amount.value).to.be.equal(2);
    expect(amount.confidence).to.be.equal(0.1);
    expect(amount.toString()).to.be.equal("2.00");
  });

  it("Should create an AmountField field with a N/A value as input", () => {
    const prediction = {
      amount: "N/A",
      confidence: 0.1,
    };
    const amount = new AmountField({ prediction });
    expect(amount.value).to.be.equal(undefined);
    expect(amount.confidence).to.be.equal(0.0);
    expect(amount.toString()).to.be.equal("");
  });
});
