import path from "path";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { MockAgent, setGlobalDispatcher } from "undici";

import { Client, PathInput } from "@/index.js";
import { MindeeHttpErrorV2 } from "@/v2/http/index.js";
import { RESOURCE_PATH, V2_RESOURCE_PATH } from "../index.js";
import fs from "node:fs/promises";
import { Crop, Extraction } from "@/v2/product/index.js";

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
      assert.strictEqual(api.settings.apiKey, "dummy");
      assert.strictEqual(api.settings.hostname, "v2-client-host");
      assert.strictEqual(api.settings.baseHeaders.Authorization, "dummy");
      assert.match(api.settings.baseHeaders["User-Agent"], /mindee/i);
    });

    it("enqueue(path) on extraction rejects with MindeeHttpErrorV2 on 400", async () => {
      const filePath = path.join(fileTypesDir, "receipt.jpg");
      const inputDoc = new PathInput({ inputPath: filePath });

      await assert.rejects(
        client.enqueue(Extraction, inputDoc, { modelId: "dummy-model", textContext: "hello" }),
        (error: any) => {
          assert.strictEqual(error instanceof MindeeHttpErrorV2, true);
          assert.strictEqual(error.status, 400);
          return true;
        }
      );
    });

    it("enqueue(path) on crop rejects with MindeeHttpErrorV2 on 400", async () => {
      const filePath = path.join(fileTypesDir, "receipt.jpg");
      const inputDoc = new PathInput({ inputPath: filePath });

      await assert.rejects(
        client.enqueue(Crop, inputDoc, { modelId: "dummy-model" }),
        (error: any) => {
          assert.strictEqual(error instanceof MindeeHttpErrorV2, true);
          assert.strictEqual(error.status, 400);
          return true;
        }
      );
    });

    it("enqueueAndGetResult(path) on extraction rejects with MindeeHttpErrorV2 on 400", async () => {
      const filePath = path.join(fileTypesDir, "receipt.jpg");
      const inputDoc = new PathInput({ inputPath: filePath });
      await assert.rejects(
        client.enqueueAndGetResult(
          Extraction,
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
          "extraction",
          "financial_document",
          "default_sample.jpg"
        ),
      });
      await assert.rejects(
        client.enqueue(Extraction, input, { modelId: "dummy-model" }),
        (error: any) => {
          assert.ok(error instanceof MindeeHttpErrorV2);
          assert.strictEqual(error.status, 400);
          assert.strictEqual(error.detail, "forced failure from test");
          return true;
        }
      );
    });

    it("getJob(jobId) returns a fully-formed JobResponse", async () => {
      const resp = await client.getJob(
        "12345678-1234-1234-1234-123456789ABC"
      );
      const job = resp.job;
      assert.strictEqual(job.id, "12345678-1234-1234-1234-123456789ABC");
      assert.strictEqual(job.modelId, "87654321-4321-4321-4321-CBA987654321");
      assert.strictEqual(job.filename, "default_sample.jpg");
      assert.strictEqual(job.alias, "dummy-alias.jpg");
      assert.strictEqual(job.createdAt?.toISOString(), "2025-07-03T14:27:58.974Z");
      assert.strictEqual(job.status, "Processing");
      assert.strictEqual(job.pollingUrl,
        "https://api-v2.mindee.net/v2/jobs/12345678-1234-1234-1234-123456789ABC"
      );
      assert.strictEqual(job.resultUrl, null);
      assert.strictEqual(job.webhooks.length, 0);
      assert.strictEqual(job.error, undefined);
    });
  });
});
