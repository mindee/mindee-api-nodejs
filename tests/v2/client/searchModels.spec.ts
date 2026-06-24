import path from "path";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { MockAgent, setGlobalDispatcher } from "undici";
import fs from "node:fs/promises";

import { Client } from "@/index.js";
import { MindeeHttpErrorV2 } from "@/v2/http/index.js";
import { V2_RESOURCE_PATH } from "../../index.js";

/**
 * Standalone test file (separate from `client.spec.ts`) to avoid
 * leftover catch-all interceptors registered there leaking into these
 * tests. We use our own MockAgent + host so the registered interceptors
 * are matched deterministically.
 */
const mockAgent = new MockAgent();
setGlobalDispatcher(mockAgent);
const mockPool = mockAgent.get("https://v2-search-host");

describe("MindeeV2 - Client.searchModels", () => {
  let client: Client;

  before(() => {
    process.env.MINDEE_V2_API_KEY = "dummy";
    process.env.MINDEE_V2_API_HOST = "v2-search-host";
  });

  after(() => {
    delete process.env.MINDEE_V2_API_KEY;
    delete process.env.MINDEE_V2_API_HOST;
  });

  beforeEach(() => {
    client = new Client({ apiKey: "dummy", dispatcher: mockAgent });
  });

  it("returns a fully-formed SearchResponse", async () => {
    mockPool
      .intercept({ path: /\/v2\/search\/models/, method: "GET" })
      .reply(
        200,
        await fs.readFile(path.join(V2_RESOURCE_PATH, "search/models.json"), { encoding: "utf-8" })
      );

    const resp = await client.searchModels("extraction", "extraction");
    assert.strictEqual(resp.models.length, 5);
    assert.strictEqual(resp.models[0].name, "Extraction With Webhooks");
    assert.strictEqual(resp.models[0].webhooks.length, 2);
    assert.strictEqual(resp.pagination.totalItems, 5);
  });

  it("rejects with MindeeHttpErrorV2 on 401", async () => {
    mockPool
      .intercept({ path: /\/v2\/search\/models/, method: "GET" })
      .reply(
        401,
        { status: 401, detail: "unauthorized", title: "Unauthorized", code: "401-001" }
      );

    await assert.rejects(
      client.searchModels(),
      (error: unknown) => {
        assert.ok(error instanceof MindeeHttpErrorV2);
        assert.strictEqual(error.status, 401);
        return true;
      }
    );
  });
});
