import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { LocalResponse } from "@/v2/index.js";
import { SearchResponse } from "@/v2/parsing/search/index.js";
import { V2_RESOURCE_PATH } from "../../index.js";

const filePath = path.join(V2_RESOURCE_PATH, "search/models.json");

describe("MindeeV2 - Search Models", () => {
  it("should load search models locally", async () => {
    const localResponse = new LocalResponse(filePath);
    const response = await localResponse.deserializeResponse(SearchResponse);

    assert.ok(response instanceof SearchResponse);

    assert.strictEqual(response.models.length, 5);
    assert.strictEqual(response.pagination.totalItems, 5);
    assert.strictEqual(response.pagination.page, 1);
    assert.strictEqual(response.pagination.perPage, 50);
    assert.strictEqual(response.pagination.totalPages, 1);

    const firstModel = response.models[0];
    assert.strictEqual(firstModel.name, "Extraction With Webhooks");
    assert.strictEqual(firstModel.id, "afde5151-aa11-aa11-9289-fa04e50ca3b9");
    assert.strictEqual(firstModel.modelType, "extraction");

    assert.strictEqual(firstModel.webhooks.length, 2);
    assert.strictEqual(firstModel.webhooks[0].id, "a2286ed9-aa11-aa11-bdc5-2f8496c5641a");
    assert.strictEqual(firstModel.webhooks[0].name, "FAILURE");
    assert.strictEqual(firstModel.webhooks[0].url, "https://failure.mindee.com");

    const lastModel = response.models[response.models.length - 1];
    assert.strictEqual(lastModel.name, "Extraction Without Webhooks Key");
    assert.strictEqual(lastModel.id, "e14e0923-ee55-ee55-a335-8d2110917d7b");
  });
});
