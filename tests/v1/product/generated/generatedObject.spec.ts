import { expect } from "chai";
import { GeneratedObjectField } from "../../../../src/parsing/generated";

describe("Generated Object Field", async () => {
  it("should properly format booleans.", async () => {
    const dummyValue = { value: false, toto: true, hello: "false", other: "true" };
    const genObjectField = new GeneratedObjectField({ prediction: dummyValue });
    expect(genObjectField.toto).to.be.true;
    expect(genObjectField.hello).to.be.equals("false");
    expect(genObjectField.other).to.be.equals("true");
    expect(genObjectField.value).to.be.false;
  });
});
