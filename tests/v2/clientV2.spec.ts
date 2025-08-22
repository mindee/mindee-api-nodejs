/* eslint-disable @typescript-eslint/naming-convention,camelcase */
import { expect } from "chai";
import nock from "nock";
import path from "node:path";
import { ClientV2, LocalResponse, PathInput, InferenceResponse } from "../../src";
import { MindeeHttpErrorV2 } from "../../src/errors/mindeeError";
import assert from "node:assert/strict";

/**
 * Injects a minimal set of environment variables so that the SDK behaves
 * as if it had been configured by the user.
 */
function dummyEnvvars(): void {
  process.env.MINDEE_V2_API_KEY = "dummy";
  process.env.MINDEE_V2_API_HOST = "dummy-url";
}

function setNockInterceptors(): void {
  nock("https://dummy-url")
    .persist()
    .post(/.*/)
    .reply(400, { status: 400, detail: "forced failure from test" });

  nock("https://dummy-url")
    .persist()
    .get(/.*/)
    .reply(200, {
      job: {
        id: "12345678-1234-1234-1234-123456789ABC",
        model_id: "87654321-4321-4321-4321-CBA987654321",
        filename: "default_sample.jpg",
        alias: "dummy-alias.jpg",
        created_at: "2025-07-03T14:27:58.974451",
        status: "Processing",
        polling_url:
          "https://api-v2.mindee.net/v2/jobs/12345678-1234-1234-1234-123456789ABC",
        result_url: null,
        webhooks: [],
        error: null,
      },
    });
}

const resourcesPath = path.join(__dirname, "..", "data");
const fileTypesDir = path.join(resourcesPath, "file_types");
const v2DataDir = path.join(resourcesPath, "v2");

describe("ClientV2", () => {
  before(() => {
    setNockInterceptors();
    dummyEnvvars();
  });

  after(() => {
    nock.cleanAll();
    delete process.env.MINDEE_V2_API_KEY;
    delete process.env.MINDEE_V2_API_HOST;
  });

  describe("Client configured via environment variables", () => {
    let client: ClientV2;

    beforeEach(() => {
      client = new ClientV2({ apiKey: "dummy" });
    });

    it("inherits base URL, token & headers from the env / options", () => {
      const api = (client as any).mindeeApi;
      expect(api.settings.apiKey).to.equal("dummy");
      expect(api.settings.hostname).to.equal("dummy-url");
      expect(api.settings.baseHeaders.Authorization).to.equal("dummy");
      expect(api.settings.baseHeaders["User-Agent"]).to.match(/mindee/i);
    });

    it("enqueue(path) rejects with MindeeHttpErrorV2 on 4xx", async () => {
      const filePath = path.join(fileTypesDir, "receipt.jpg");
      const inputDoc = new PathInput({ inputPath: filePath });

      await assert.rejects(
        client.enqueueInference(inputDoc, { modelId: "dummy-model" }),
        MindeeHttpErrorV2
      );
    });

    it("enqueueAndParse(path) rejects with MindeeHttpErrorV2 on 4xx", async () => {
      const filePath = path.join(fileTypesDir, "receipt.jpg");
      const inputDoc = new PathInput({ inputPath: filePath });
      await assert.rejects(
        client.enqueueAndGetInference(
          inputDoc,
          { modelId: "dummy-model" }
        ),
        MindeeHttpErrorV2
      );
    });

    it("loading an inference works on stored JSON fixtures", async () => {
      const jsonPath = path.join(
        v2DataDir,
        "products",
        "financial_document",
        "complete.json"
      );

      const localResponse = new LocalResponse(jsonPath);
      const response: InferenceResponse = await localResponse.deserializeResponse(InferenceResponse);

      expect(response.inference.model.id).to.equal(
        "12345678-1234-1234-1234-123456789abc"
      );
    });

    it("bubble-up HTTP errors with details", async () => {
      const input = new PathInput({
        inputPath: path.join(
          v2DataDir,
          "products",
          "financial_document",
          "default_sample.jpg"
        ),
      });
      try {
        await client.enqueueInference(input, { modelId: "dummy-model" });
        expect.fail("enqueue() should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(MindeeHttpErrorV2);
        const httpErr = err as MindeeHttpErrorV2;
        expect(httpErr.status).to.equal(400);
        expect(httpErr.detail).to.equal("forced failure from test");
      }
    });

    it("parseQueued(jobId) returns a fully-formed JobResponse", async () => {
      const resp = await client.getJob(
        "12345678-1234-1234-1234-123456789ABC"
      );
      const job = resp.job;
      expect(job.id).to.equal("12345678-1234-1234-1234-123456789ABC");
      expect(job.modelId).to.equal("87654321-4321-4321-4321-CBA987654321");
      expect(job.filename).to.equal("default_sample.jpg");
      expect(job.alias).to.equal("dummy-alias.jpg");
      expect(job.createdAt?.toISOString()).to.equal("2025-07-03T14:27:58.974Z");
      expect(job.status).to.equal("Processing");
      expect(job.pollingUrl).to.equal(
        "https://api-v2.mindee.net/v2/jobs/12345678-1234-1234-1234-123456789ABC"
      );
      expect(job.resultUrl).to.be.null;
      expect(job.webhooks).to.have.length(0);
      expect(job.error).to.be.undefined;
    });
  });
});
