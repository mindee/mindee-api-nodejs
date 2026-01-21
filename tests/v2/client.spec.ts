import { expect } from "chai";
import { MockAgent, setGlobalDispatcher } from "undici";
import path from "node:path";
import { Client, PathInput } from "@/index.js";
import { MindeeHttpErrorV2 } from "@/v2/http/index.js";
import assert from "node:assert/strict";
import { RESOURCE_PATH, V2_RESOURCE_PATH } from "../index.js";
import fs from "node:fs/promises";
import { CropResponse } from "@/v2/parsing/index.js";

const mockAgent = new MockAgent();
setGlobalDispatcher(mockAgent);
const mockPool = mockAgent.get("https://v2-client-host");

/**
 * Injects a minimal set of environment variables so that the SDK behaves
 * as if it had been configured by the user.
 */
function dummyEnvvars(): void {
  process.env.MINDEE_V2_API_KEY = "dummy";
  process.env.MINDEE_V2_API_HOST = "v2-client-host";
}

async function setInterceptor(statusCode: number, filePath: string): Promise<void> {
  const fileObj = await fs.readFile(filePath, { encoding: "utf-8" });
  mockPool
    .intercept({ path: /.*/, method: "GET" })
    .reply(statusCode, fileObj);
}

async function setAllInterceptors(): Promise<void> {
  mockPool
    .intercept({ path: /.*/, method: "POST" })
    .reply(
      400,
      { status: 400, detail: "forced failure from test", title: "Bad Request", code: "400-001" }
    );
  await setInterceptor(
    200,
    path.join(V2_RESOURCE_PATH, "job/ok_processing.json")
  );
}

describe("MindeeV2 - ClientV2", () => {
  const fileTypesDir = path.join(RESOURCE_PATH, "file_types");

  before(() => {
    dummyEnvvars();
  });

  after(() => {
    delete process.env.MINDEE_V2_API_KEY;
    delete process.env.MINDEE_V2_API_HOST;
  });

  describe("Client configured via environment variables", () => {
    let client: Client;

    beforeEach(async () => {
      await setAllInterceptors();
      client = new Client({ apiKey: "dummy", debug: true, dispatcher: mockAgent });
    });

    it("inherits base URL, token & headers from the env / options", () => {
      const api = (client as any).mindeeApi;
      expect(api.settings.apiKey).to.equal("dummy");
      expect(api.settings.hostname).to.equal("v2-client-host");
      expect(api.settings.baseHeaders.Authorization).to.equal("dummy");
      expect(api.settings.baseHeaders["User-Agent"]).to.match(/mindee/i);
    });

    it("enqueueInference(path) rejects with MindeeHttpErrorV2 on 400", async () => {
      const filePath = path.join(fileTypesDir, "receipt.jpg");
      const inputDoc = new PathInput({ inputPath: filePath });

      await assert.rejects(
        client.enqueueExtraction(inputDoc, { modelId: "dummy-model", textContext: "hello" }),
        (error: any) => {
          assert.strictEqual(error instanceof MindeeHttpErrorV2, true);
          assert.strictEqual(error.status, 400);
          return true;
        }
      );
    });

    it("enqueueUtility(path) rejects with MindeeHttpErrorV2 on 400", async () => {
      const filePath = path.join(fileTypesDir, "receipt.jpg");
      const inputDoc = new PathInput({ inputPath: filePath });

      await assert.rejects(
        client.enqueueInference(CropResponse, inputDoc, { modelId: "dummy-model" }),
        (error: any) => {
          assert.strictEqual(error instanceof MindeeHttpErrorV2, true);
          assert.strictEqual(error.status, 400);
          return true;
        }
      );
    });

    it("enqueueAndGetInference(path) rejects with MindeeHttpErrorV2 on 400", async () => {
      const filePath = path.join(fileTypesDir, "receipt.jpg");
      const inputDoc = new PathInput({ inputPath: filePath });
      await assert.rejects(
        client.enqueueAndGetExtraction(
          inputDoc,
          { modelId: "dummy-model", rag: false }
        ),
        (error: any) => {
          assert.strictEqual(error instanceof MindeeHttpErrorV2, true);
          assert.strictEqual(error.status, 400);
          return true;
        }
      );
    });

    it("bubble-up HTTP errors with details", async () => {
      const input = new PathInput({
        inputPath: path.join(
          V2_RESOURCE_PATH,
          "products",
          "financial_document",
          "default_sample.jpg"
        ),
      });
      await assert.rejects(
        client.enqueueExtraction(input, { modelId: "dummy-model" }),
        (error: any) => {
          expect(error).to.be.instanceOf(MindeeHttpErrorV2);
          expect(error.status).to.equal(400);
          expect(error.detail).to.equal("forced failure from test");
          return true;
        }
      );
    });

    it("getJob(jobId) returns a fully-formed JobResponse", async () => {
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
