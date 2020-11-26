const expect = require("chai").expect;

const mindee = require("mindee");

describe("Simple unit test", () => {
  it('should be equal to "Hello world"', () => {
    expect(mindee.hello()).to.equal("Hello world");
  });
});
