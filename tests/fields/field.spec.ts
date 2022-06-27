import { expect } from "chai";
import { Field } from "../../mindee/documents/fields";

describe("Test differents init of Field", () => {
  it("Should create a Field", () => {
    const prediction = {
      value: "test",
      confidence: 0.1,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    const field = new Field({ prediction });
    // const field = new Field({ prediction });
    expect(field.value).to.equals("test");
    expect(field.confidence).to.equals(0.1);
    expect(field.bbox.length).to.satisfy((length: number) => length > 0);
  });

  it("should not create a bbox", () => {
    const prediction = {
      value: "test",
      confidence: 0.1,
    };
    const field = new Field({ prediction });
    expect(field.bbox.length).to.equals(0);
  });

  it("should be equal to itself only", () => {
    const prediction1 = {
      value: "test",
      confidence: 0.1,
    };
    const prediction2 = {
      value: "other",
      confidence: 0.1,
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
    expect(field.confidence).to.be.equals(0.0);
  });

  it("should manipulate multiple fields", () => {
    const fields = [
      new Field({ prediction: { value: 1, confidence: 0.1 } }),
      new Field({ prediction: { value: 2, confidence: 0.8 } }),
    ];
    expect(Field.arrayConfidence(fields)).to.be.equals(0.8 * 0.1);
    expect(Field.arraySum(fields)).to.be.equals(3);
    const fields2 = [
      new Field({ prediction: { value: undefined, confidence: undefined } }),
      new Field({ prediction: { value: 4, confidence: 0.8 } }),
    ];
    expect(Field.arrayConfidence(fields2)).to.be.equals(0.0);
    expect(Field.arraySum(fields2)).to.be.equals(0.0);
  });
});
