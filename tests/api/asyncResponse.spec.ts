import { expect } from "chai";
import { AsyncPredictResponse } from "../../src";
import { promises as fs } from "fs";
import * as path from "path";
import { StringDict } from "../../src/parsing/common";
import { InvoiceSplitterV1 } from "../../src/product";

describe("Asynchronous API predict response", () => {
  it("should parse a successful enqueue", async () => {
    const jsonData = await fs.readFile(
      path.resolve("tests/data/async/post_success.json")
    );
    const httpResponse: StringDict = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new AsyncPredictResponse(InvoiceSplitterV1, httpResponse.data);
    expect(response.job).to.not.be.undefined;
    expect(response.job.issuedAt.toISOString()).to.be.equals(
      "2023-02-16T12:33:49.602Z"
    );
    expect(response.job.availableAt?.toISOString()).to.be.undefined;
    expect(response.apiRequest.error).to.deep.equal({});
  });

  it("should parse a failed enqueue", async () => {
    const jsonData = await fs.readFile(
      path.resolve("tests/data/async/post_fail_forbidden.json")
    );
    const httpResponse: StringDict = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new AsyncPredictResponse(InvoiceSplitterV1, httpResponse.data);
    expect(response.job).to.not.be.undefined;
    expect(response.job.issuedAt.toISOString()).to.be.equals(
      "2023-01-01T00:00:00.000Z"
    );
    expect(response.job.availableAt?.toISOString()).to.be.undefined;
    expect(response.apiRequest.error.code).to.equals("Forbidden");
  });

  it("should parse a job in progress", async () => {
    const jsonData = await fs.readFile(
      path.resolve("tests/data/async/get_processing.json")
    );
    const httpResponse: StringDict = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new AsyncPredictResponse(InvoiceSplitterV1, httpResponse.data);
    expect(response.job).to.not.be.undefined;
    expect(response.job.issuedAt.toISOString()).to.be.equals(
      "2023-03-16T12:33:49.602Z"
    );
    expect(response.job.availableAt?.toISOString()).to.be.undefined;
    expect(response.apiRequest.error).to.deep.equal({});
  });

  it("should parse a completed job", async () => {
    const jsonData = await fs.readFile(
      path.resolve("tests/data/async/get_completed.json")
    );
    const httpResponse: StringDict = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new AsyncPredictResponse(InvoiceSplitterV1, httpResponse.data);
    expect(response.job).to.not.be.undefined;
    expect(response.job.issuedAt.toISOString()).to.be.equals(
      "2023-03-21T13:52:56.326Z"
    );
    expect(response.job.availableAt?.toISOString()).to.be.equals(
      "2023-03-21T13:53:00.990Z"
    );
    expect(response.job.milliSecsTaken)?.to.equal(4664);
    expect(response.apiRequest.error).to.deep.equal({});
  });
});
