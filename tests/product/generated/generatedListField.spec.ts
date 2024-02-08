import { expect } from "chai";
import { GeneratedListField } from "../../../src/parsing/generated";

describe("Generated List Field Objects", async () => {
  it("should properly format floats.", async () => {
    const dummyValue = [{ value: "123.40" }, { value: 567.8 }];
    const genListField = new GeneratedListField({ prediction: dummyValue });
    expect((genListField.values[0] as any).value).to.equals("123.40");
    expect((genListField.values[1] as any).value).to.equals("567.8");
  });
});
