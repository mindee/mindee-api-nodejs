import { describe } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@/v2/index.js";
import { beforeEach } from "node:test";
import { it } from "node:test";
import { ModelSearch, ModelSearchResponse } from "@/v2/search/index.js";

describe("MindeeV2 - Integration - Model Search", { timeout: 120000 }, () => {
  let client: Client;

  beforeEach(() => {
    const apiKey = process.env["MINDEE_V2_API_KEY"] ?? "";

    client = new Client({ apiKey: apiKey, debug: true });
  });

  it("model search must have results", async () => {
    const response: ModelSearchResponse = await client.search(ModelSearch, {});
    assert.ok(response);
    assert.ok(response.models.length > 0);
    assert.ok(response.pagination);
    assert.ok(response.pagination.totalItems >= 1);
    assert.equal(response.pagination.page, 1);
  });

  it("model search must return empty", async () => {
    const response: ModelSearchResponse = await client.search(ModelSearch, { name: "je n'existe pas tralala" });
    assert.ok(response);
    assert.equal(response.models.length, 0);
    assert.ok(response.pagination);
    assert.equal(response.pagination.totalItems, 0);
    assert.equal(response.pagination.page, 1);
  });
});
