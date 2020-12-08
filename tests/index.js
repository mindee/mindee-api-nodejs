const expect = require("chai").expect;
const mindee = require("mindee");

describe("Test client initialization", () => {
  it("should create a client", () => {
    const client = new mindee.Client();
    expect(client).to.exist;
  });
});
