import { Client } from "../mindee";
import { expect } from "chai";

describe("Test client initialization", () => {
  it("should create a client", () => {
    const client = new Client();
    expect(client).to.exist;
  });
});
