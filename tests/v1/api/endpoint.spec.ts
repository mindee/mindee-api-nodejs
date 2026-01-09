import * as fs from "node:fs";
import * as path from "path";
import { expect } from "chai";
import { MockAgent, setGlobalDispatcher } from "undici";
import { Client, PathInput, product } from "@/index.js";
import { RESOURCE_PATH, V1_RESOURCE_PATH } from "../../index.js";
import assert from "node:assert/strict";
import {
  MindeeHttp400Error, MindeeHttp401Error, MindeeHttp429Error, MindeeHttp500Error
} from "@/http/index.js";

const mockAgent = new MockAgent();
setGlobalDispatcher(mockAgent);
const mockPool = mockAgent.get("https://v1-endpoint-host");

function setInterceptor(httpCode: number, httpResultFile: string) {
  const filePath = path.resolve(path.join(V1_RESOURCE_PATH, httpResultFile));
  mockPool
    .intercept({ path: /.*/, method: "POST" })
    .reply(
      httpCode,
      fs.readFileSync(filePath, "utf8"),
      {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { "content-type": "application/json" }
      }
    );
}

describe("MindeeV1 - HTTP calls", () => {
  const doc = new PathInput({
    inputPath: path.join(RESOURCE_PATH, "file_types/pdf/blank_1.pdf")
  });

  beforeEach(async function() {
    process.env.MINDEE_API_HOST = "v1-endpoint-host";
  });

  afterEach(async function() {
    delete process.env.MINDEE_API_HOST;
  });

  it("should fail on 400 response with object", async () => {
    setInterceptor(400, "errors/error_400_with_object_in_detail.json");
    const client = new Client({ apiKey: "my-api-key", debug: true, dispatcher: mockAgent });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        expect(error).to.be.instanceOf(MindeeHttp400Error);
        expect(error.code).to.be.equals(400);
        expect(error.message).to.be.undefined;
        expect(error.details).to.deep.equal({ document: ["error message"] });
        return true;
      });
  });

  it("should fail on 401 response", async () => {
    setInterceptor(401, "errors/error_401_no_token.json");
    const client = new Client({ apiKey: "my-api-key", debug: true, dispatcher: mockAgent });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        expect(error).to.be.instanceOf(MindeeHttp401Error);
        expect(error.code).to.be.equals(401);
        expect(error.message).to.be.equals("Authorization required");
        expect(error.details).to.be.equals("No token provided");
        return true;
      });
  });

  it("should fail on 429 response", async () => {
    setInterceptor(429, "errors/error_429_too_many_requests.json");
    const client = new Client({ apiKey: "my-api-key", debug: true, dispatcher: mockAgent });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        expect(error).to.be.instanceOf(MindeeHttp429Error);
        expect(error.code).to.be.equals(429);
        expect(error.message).to.be.equals("Too many requests");
        expect(error.details).to.be.equals("Too Many Requests.");
        return true;
      });
  });

  it("should fail on 500 response", async () => {
    setInterceptor(500, "errors/error_500_inference_fail.json");
    const client = new Client({ apiKey: "my-api-key", debug: true, dispatcher: mockAgent });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        expect(error).to.be.instanceOf(MindeeHttp500Error);
        expect(error.code).to.be.equals(500);
        expect(error.message).to.be.equals("Inference failed");
        expect(error.details).to.be.equals("Can not run prediction: ");
        return true;
      });
  });

  it("should fail on HTML response", async () => {
    setInterceptor(500, "errors/error_50x.html");
    const client = new Client({ apiKey: "my-api-key", debug: true, dispatcher: mockAgent });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        expect(error).to.be.instanceOf(MindeeHttp500Error);
        expect(error.code).to.be.equals(500);
        return true;
      });
  });
});

describe ("Endpoint parameters" , () => {
  it ("should initialize default parameters properly", async () => {
    const client = new Client({ apiKey: "dummy-api-key", debug: true });
    const customEndpoint = client.createEndpoint(
      "dummy-endpoint",
      "dummy-account"
    );
    expect(customEndpoint.version).to.equal("1");
    expect(customEndpoint.settings.timeout).to.equal(120);
    expect(customEndpoint.settings.hostname).to.equal("api.mindee.net");
    expect(customEndpoint.settings.apiKey).to.equal("dummy-api-key");
  });

  it ("should initialize environment parameters properly", async () => {
    process.env.MINDEE_API_HOST = "v1-endpoint-host";
    process.env.MINDEE_API_KEY = "dummy-key";
    process.env.MINDEE_REQUEST_TIMEOUT = "30";

    const client = new Client({ debug: true });
    const customEndpoint = client.createEndpoint(
      "dummy-endpoint",
      "dummy-account"
    );
    expect(customEndpoint.version).to.equal("1");
    expect(customEndpoint.settings.timeout).to.equal(30);
    expect(customEndpoint.settings.hostname).to.equal("v1-endpoint-host");
    expect(customEndpoint.settings.apiKey).to.equal("dummy-key");

    delete process.env.MINDEE_API_HOST;
    delete process.env.MINDEE_API_KEY;
  });
});
