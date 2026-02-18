import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import path from "path";
import * as fs from "node:fs";
import { MockAgent, setGlobalDispatcher } from "undici";
import { PathInput } from "@/index.js";
import { Client, product } from "@/v1/index.js";
import { RESOURCE_PATH, V1_RESOURCE_PATH } from "../../index.js";
import {
  MindeeHttp400Error, MindeeHttp401Error, MindeeHttp429Error, MindeeHttp500Error
} from "@/v1/http/index.js";

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
        assert.ok(error instanceof MindeeHttp400Error);
        assert.strictEqual(error.code, 400);
        assert.strictEqual(error.message, undefined);
        assert.deepStrictEqual(error.details, { document: ["error message"] });
        return true;
      });
  });

  it("should fail on 401 response", async () => {
    setInterceptor(401, "errors/error_401_no_token.json");
    const client = new Client({ apiKey: "my-api-key", debug: true, dispatcher: mockAgent });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        assert.ok(error instanceof MindeeHttp401Error);
        assert.strictEqual(error.code, 401);
        assert.strictEqual(error.message, "Authorization required");
        assert.strictEqual(error.details, "No token provided");
        return true;
      });
  });

  it("should fail on 429 response", async () => {
    setInterceptor(429, "errors/error_429_too_many_requests.json");
    const client = new Client({ apiKey: "my-api-key", debug: true, dispatcher: mockAgent });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        assert.ok(error instanceof MindeeHttp429Error);
        assert.strictEqual(error.code, 429);
        assert.strictEqual(error.message, "Too many requests");
        assert.strictEqual(error.details, "Too Many Requests.");
        return true;
      });
  });

  it("should fail on 500 response", async () => {
    setInterceptor(500, "errors/error_500_inference_fail.json");
    const client = new Client({ apiKey: "my-api-key", debug: true, dispatcher: mockAgent });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        assert.ok(error instanceof MindeeHttp500Error);
        assert.strictEqual(error.code, 500);
        assert.strictEqual(error.message, "Inference failed");
        assert.strictEqual(error.details, "Can not run prediction: ");
        return true;
      });
  });

  it("should fail on HTML response", async () => {
    setInterceptor(500, "errors/error_50x.html");
    const client = new Client({ apiKey: "my-api-key", debug: true, dispatcher: mockAgent });
    await assert.rejects(
      client.parse(product.InvoiceV4, doc),
      (error: any) => {
        assert.ok(error instanceof MindeeHttp500Error);
        assert.strictEqual(error.code, 500);
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
    assert.strictEqual(customEndpoint.version, "1");
    assert.strictEqual(customEndpoint.settings.timeoutSecs, 120);
    assert.strictEqual(customEndpoint.settings.hostname, "api.mindee.net");
    assert.strictEqual(customEndpoint.settings.apiKey, "dummy-api-key");
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
    assert.strictEqual(customEndpoint.version, "1");
    assert.strictEqual(customEndpoint.settings.timeoutSecs, 30);
    assert.strictEqual(customEndpoint.settings.hostname, "v1-endpoint-host");
    assert.strictEqual(customEndpoint.settings.apiKey, "dummy-key");

    delete process.env.MINDEE_API_HOST;
    delete process.env.MINDEE_API_KEY;
  });
});
