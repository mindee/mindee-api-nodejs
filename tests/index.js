const { should } = require("chai");
const mindee = require("mindee");

describe("Test client initialization", () => {
  it("should create a client", () => {
    const client = new mindee.Client();
    should.exist(client);
  });
});
