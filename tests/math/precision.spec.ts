import { expect } from "chai";
import { precisionEquals } from "../../src/math";

describe("Math precision", () => {
  it("compare with tolerance must success", async () => {
    expect(precisionEquals(0.41, 0.42, 0.011)).to.be.true;
  });
  it("compare with tolerance must fail", async () => {
    expect(precisionEquals(0.41, 0.42, 0.005)).to.be.false;
  });
  it("compare without tolerance must fail", async () => {
    expect(precisionEquals(0.41, 0.42, 0)).to.be.false;
  });
});
