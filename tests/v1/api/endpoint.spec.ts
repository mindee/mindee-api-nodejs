import nock from "nock";
import * as path from "path";
import { expect } from "chai";
import { Client, PathInput, product } from "@/index.js";
import { RESOURCE_PATH, V1_RESOURCE_PATH } from "../../index.js";
import assert from "node:assert/strict";
import {
  MindeeHttp400Error, MindeeHttp401Error, MindeeHttp429Error, MindeeHttp500Error
} from "@/http/index.js";


async function setNockInterceptors(httpCode: number, httpResultFile: string) {
  nock("https://v1-dummy-host")
    .post(/.*/)
    .replyWithFile(
      httpCode, path.resolve(path.join(V1_RESOURCE_PATH, httpResultFile))
    );
}

describe("MindeeV1 - HTTP calls", () => {
  const doc = new PathInput({
    inputPath: path.join(RESOURCE_PATH, "file_types/pdf/blank_1.pdf")
  });

  beforeEach(function() {
    process.env.MINDEE_API_HOST = "v1-dummy-host";
  });

  afterEach(function() {
    delete process.env.MINDEE_API_HOST;
  });

  it("should fail on 400 response with object", async () => {
    await setNockInterceptors(400, "errors/error_400_with_object_in_detail.json");
    const client = new Client({ apiKey: "my-api-key", debug: true });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        expect(error).to.be.instanceOf(MindeeHttp400Error);
        expect(error.status).to.equal(400);
        expect(error.code).to.be.equals(400);
        // nock adds a server message
        //expect(error.message).to.be.equals("Bad Request");
        expect(error.details).to.deep.equal({ document: ["error message"] });
        return true;
      });
  });

  it("should fail on 401 response", async () => {
    await setNockInterceptors(401, "errors/error_401_no_token.json");
    const client = new Client({ apiKey: "my-api-key", debug: true });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        expect(error).to.be.instanceOf(MindeeHttp401Error);
        expect(error.code).to.be.equals(401);
        expect(error.message).to.be.equals("Authorization required");
        expect(error.details).to.be.equals("No token provided");
      });
  });

  it("should fail on 429 response", async () => {
    await setNockInterceptors(429, "errors/error_429_too_many_requests.json");
    const client = new Client({ apiKey: "my-api-key", debug: true });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        expect(error).to.be.instanceOf(MindeeHttp429Error);
        expect(error.code).to.be.equals(429);
        expect(error.message).to.be.equals("Too many requests");
        expect(error.details).to.be.equals("Too Many Requests.");
      });
  });

  it("should fail on 500 response", async () => {
    await setNockInterceptors(500, "errors/error_500_inference_fail.json");
    const client = new Client({ apiKey: "my-api-key", debug: true });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        expect(error).to.be.instanceOf(MindeeHttp500Error);
        expect(error.code).to.be.equals(500);
        expect(error.message).to.be.equals("Inference failed");
        expect(error.details).to.be.equals("Can not run prediction: ");
      });
  });

  it("should fail on HTML response", async () => {
    await setNockInterceptors(500, "errors/error_50x.html");
    const client = new Client({ apiKey: "my-api-key", debug: true });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        expect(error).to.be.instanceOf(MindeeHttp500Error);
        expect(error.code).to.be.equals(500);
      });
  });
});

describe ("Endpoint parameters" , () => {
  it ("should initialize default parameters properly", async () => {
    const mindeeClient = new Client({ apiKey: "dummy-api-key", debug: true });
    const customEndpoint = mindeeClient.createEndpoint(
      "dummy-endpoint",
      "dummy-account"
    );
    expect(customEndpoint.version).to.equal("1");
    expect(customEndpoint.settings.timeout).to.equal(120);
    expect(customEndpoint.settings.hostname).to.equal("api.mindee.net");
    expect(customEndpoint.settings.apiKey).to.equal("dummy-api-key");
  });

  it ("should initialize environment parameters properly", async () => {
    process.env.MINDEE_API_HOST = "v1-dummy-host";
    process.env.MINDEE_API_KEY = "dummy-key";
    process.env.MINDEE_REQUEST_TIMEOUT = "30";

    const mindeeClient = new Client({ debug: true });
    const customEndpoint = mindeeClient.createEndpoint(
      "dummy-endpoint",
      "dummy-account"
    );
    expect(customEndpoint.version).to.equal("1");
    expect(customEndpoint.settings.timeout).to.equal(30);
    expect(customEndpoint.settings.hostname).to.equal("v1-dummy-host");
    expect(customEndpoint.settings.apiKey).to.equal("dummy-key");

    delete process.env.MINDEE_API_HOST;
    delete process.env.MINDEE_API_KEY;
  });
});
