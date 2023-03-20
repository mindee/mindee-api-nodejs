import { expect } from "chai";
import { PredictEnqueueResponse } from "../../src";
import { promises as fs } from "fs";
import path from "path";
import { StringDict } from "../../src/fields";


describe("Asynchronous API predict response", () => {
  it("should parse a successful enqueue", async () => {
    const jsonData = await fs.readFile(
      path.resolve("tests/data/async/enqueue_success_response.json")
    );
    const httpResponse: StringDict = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new PredictEnqueueResponse(httpResponse.data["api_request"], httpResponse.data["job"]);
    expect(response.job).to.not.be.undefined;
    expect(response.job.issuedAt.toISOString()).to.be.equals(
      "2023-02-16T12:33:49.602Z"
    );
    expect(response.job.availableAt?.toISOString()).to.be.equals(
      "2023-02-16T11:14:27.931Z"
    );
    expect(response.apiRequest.error).to.deep.equal({});
  });

  it("should parse a failed enqueue", async () => {
    const jsonData = await fs.readFile(
      path.resolve("tests/data/async/enqueue_fail_async_forbidden.json")
    );
    const httpResponse: StringDict = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new PredictEnqueueResponse(httpResponse.data["api_request"], httpResponse.data["job"]);
    expect(response.job).to.not.be.undefined;
    expect(response.job.issuedAt.toISOString()).to.be.equals(
      "2023-01-01T00:00:00.000Z"
    );
    expect(response.job.availableAt?.toISOString()).to.be.undefined;
    expect(response.apiRequest.error.code).to.equals("Forbidden");
  });
});
