import { expect } from "chai";
import { AsyncPredictResponse } from "@/index.js";
import { promises as fs } from "fs";
import * as path from "path";
import { StringDict } from "@/v1/parsing/common/index.js";
import { InvoiceSplitterV1 } from "@/v1/product/index.js";
import { cleanRequestData, isValidAsyncResponse } from "@/http/index.js";
import { RESOURCE_PATH } from "../../index.js";

describe("MindeeV1 - Asynchronous API predict response", () => {
  it("should parse a successful enqueue", async () => {
    const jsonData = await fs.readFile(
      path.join(RESOURCE_PATH, "v1/async/post_success.json")
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
      path.join(RESOURCE_PATH, "v1/async/post_fail_forbidden.json")
    );
    const httpResponse: StringDict = {
      data: JSON.parse(jsonData.toString()),
    };
    expect(isValidAsyncResponse(cleanRequestData(httpResponse.data))).to.be.false;
  });

  it("should parse a failed job", async () => {
    const jsonData = await fs.readFile(
      path.join(RESOURCE_PATH, "v1/async/get_failed_job_error.json")
    );
    const httpResponse: StringDict = {
      data: JSON.parse(jsonData.toString()),
    };
    expect(isValidAsyncResponse(cleanRequestData(httpResponse.data))).to.be.false;
  });

  it("should parse a job in progress", async () => {
    const jsonData = await fs.readFile(
      path.join(RESOURCE_PATH, "v1/async/get_processing.json")
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
      path.join(RESOURCE_PATH, "v1/async/get_completed.json")
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
    expect(response.job.milliSecsTaken)?.to.equals(4664);
    expect(response.apiRequest.error).to.deep.equal({});
  });
});
