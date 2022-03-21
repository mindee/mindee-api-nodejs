import { Tax } from "@mindee/documents/fields";
import { expect } from "chai";

describe("Test Tax field", () => {
  it("should create a Tax field", () => {
    const prediction = {
      value: "2",
      rate: 0.2,
      code: "QST",
      confidence: 0.1,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    const tax = new Tax({ prediction, valueKey: "value" });
    expect(tax.value).to.be.equal(2);
    expect(tax.probability).to.be.equal(0.1);
    expect(tax.rate).to.be.equal(0.2);
    expect(tax.bbox.length).to.be.equal(4);
    expect(tax.toString()).to.be.equal("2; 0.2%; QST");
  });

  it("should create a Tax with rate not valid", () => {
    const prediction = {
      value: 2,
      rate: "aa",
      confidence: 0.1,
    };
    const tax = new Tax({ prediction });
    expect(tax.rate).to.be.undefined;
    expect(tax.bbox.length).to.be.equal(0);
  });

  it("should create a Tax with amount not valid", () => {
    const prediction = {
      value: "NA",
      rate: "AA",
      code: "N/A",
      confidence: 0.1,
    };
    const tax = new Tax({ prediction });
    expect(tax.value).to.be.undefined;
    expect(typeof tax.toString()).to.equal("string");
  });
});
