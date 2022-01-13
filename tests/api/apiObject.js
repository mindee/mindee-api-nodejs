const APIObject = require("mindee").api.APIObject;
const Input = require("mindee").inputs;
const fs = require("fs").promises;
const expect = require("chai").expect;
const path = require("path");

describe("test APIObject", () => {
  it("should construct an APIObject", () => {
    const apiObject = new APIObject("dummyToken", "dummyApiName");
    expect(apiObject.apiToken).to.be.equal("dummyToken");
    expect(apiObject.apiName).to.be.equal("dummyApiName");
    expect(apiObject.baseUrl).to.be.equal(
      "https://api.mindee.net/v1/products/mindee/"
    );
  });

  it("should return a Response Object with an Receipt inside", async () => {
    const apiObject = new APIObject("dummyToken", "dummyApiName");
    const jsonData = await fs.readFile(
      path.resolve("tests/data/api/receipt/v3/receipt.json")
    );
    const apiResponse = JSON.parse(jsonData);
    const input = new Input({ inputType: "dummy" });
    const response = apiObject.wrapResponse(input, apiResponse, "receipt");
    expect(response.receipt.date.value).to.be.equal("2018-04-08");
    expect(response.receipt.totalTax.value).to.be.equal(0.43);
    expect(response.receipt.checklist.taxesMatchTotalIncl).to.be.true;
    expect(typeof response.receipt.toString()).to.be.equal("string");
  });
});
