const Amount = require("mindee").documents.fields.amount;
const expect = require("chai").expect;

describe("Test Amount field", () => {
  it("Should create an Amount field", () => {
    const prediction = {
      amount: "2",
      probability: 0.1,
      segmentation: {
        bounding_box: [
          [0.016, 0.707],
          [0.414, 0.707],
          [0.414, 0.831],
          [0.016, 0.831],
        ],
      },
    };
    const amount = new Amount({ prediction });
    expect(amount.value).to.be.equal(2);
    expect(amount.value - amount.value).to.be.equal(0);
  });
  it("Should create an Amount field with a N/A value as input", () => {
    const prediction = {
      amount: "N/A",
      probability: 0.1,
    };
    const amount = new Amount({ prediction });
    expect(amount.value).to.be.equal(undefined);
  });
});
