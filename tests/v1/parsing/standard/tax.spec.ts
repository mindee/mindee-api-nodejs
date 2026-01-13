import { TaxField } from "@/v1/parsing/standard/index.js";
import { expect } from "chai";

describe("Test Tax field", () => {
  it("should create a Tax field", () => {
    const prediction = {
      value: "2",
      rate: 0.2,
      code: "QST",
      confidence: 0.1,
      base: 5,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    const tax = new TaxField({ prediction, valueKey: "value" });
    expect(tax.value).to.be.equal(2);
    expect(tax.confidence).to.be.equal(0.1);
    expect(tax.rate).to.be.equal(0.2);
    expect(tax.boundingBox.length).to.be.equal(4);
    expect(tax.toString()).to.be.equal("Base: 5.00, Code: QST, Rate (%): 0.20, Amount: 2.00");
  });

  it("should create a Tax with rate not valid", () => {
    const prediction = {
      value: 2,
      rate: "aa",
      confidence: 0.1,
    };
    const tax = new TaxField({ prediction });
    expect(tax.rate).to.be.undefined;
    expect(tax.polygon.length).to.be.equal(0);
    expect(tax.toString()).to.be.equal("Base: , Code: , Rate (%): , Amount: 2.00");
  });

  it("should create a Tax with amount not valid", () => {
    const prediction = {
      value: "NA",
      rate: "AA",
      code: "N/A",
      confidence: 0.1,
    };
    const tax = new TaxField({ prediction });
    expect(tax.value).to.be.undefined;
    expect(tax.toString()).to.be.equal("Base: , Code: , Rate (%): , Amount:");
  });
});
