const Field = require("../../mindee/documents/fields/field");
const expect = require("chai").expect;

describe("Test differents init of Field", () => {
  it("Should create a Field", () => {
    const prediction = {
      value: "test",
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
    const field = new Field({ prediction });
    expect(field.value).to.equals("test");
    expect(field.probability).to.equals(0.1);
    expect(field.bbox.length).to.satisfy((length) => length > 0);
  });

  it("should not create a bbox", () => {
    const prediction = {
      value: "test",
      probability: 0.1,
    };
    const field = new Field({ prediction });
    expect(field.bbox.length).to.equals(0);
  });

  it("should be equal to itself only", () => {
    const prediction1 = {
      value: "test",
      probability: 0.1,
    };
    const prediction2 = {
      value: "other",
      probability: 0.1,
    };
    const field1 = new Field({ prediction: prediction1 });
    const field2 = new Field({ prediction: prediction2 });
    expect(field1.compare(field1)).to.be.true;
    expect(field1.compare(field2)).to.not.be.true;
  });

  it("should create with an N/A value", () => {
    const prediction = {
      value: null,
    };
    const field = new Field({ prediction });
    expect(field.value).to.be.undefined;
    expect(field.probability).to.be.equals(0.0);
  });

  it("should manipulate multiple fields", () => {
    const fields = [
      new Field({ prediction: { value: 1, probability: 0.1 } }),
      new Field({ prediction: { value: 2, probability: 0.8 } }),
    ];
    expect(Field.arrayProbability(fields)).to.be.equals(0.8 * 0.1);
    expect(Field.arraySum(fields)).to.be.equals(3);
    const fields2 = [
      new Field({ prediction: { value: undefined, probability: undefined } }),
      new Field({ prediction: { value: 4, probability: 0.8 } }),
    ];
    expect(Field.arrayProbability(fields2)).to.be.equals(0.0);
    expect(Field.arraySum(fields2)).to.be.equals(0.0);
  });
});
