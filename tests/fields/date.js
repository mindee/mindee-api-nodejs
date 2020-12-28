const DateField = require("mindee").documents.fields.date;
const expect = require("chai").expect;

describe("Test Date field", () => {
  it("Should create a Date field", () => {
    const prediction = {
      iso: "2018-04-01",
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
    const date = new DateField({ prediction });
    expect(date.value).to.be.equal(prediction.iso);
    expect(date.dateObject).to.be.deep.equal(new Date(prediction.iso));
  });
  it("Should create a Date field with N/A value as input", () => {
    const prediction = {
      iso: "N/A",
      probability: 0.1,
    };
    const date = new DateField({ prediction });
    expect(date.value).to.be.equal(undefined);
    expect(date.dateObject).to.be.equal(undefined);
  });
});
