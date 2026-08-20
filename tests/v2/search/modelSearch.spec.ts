import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { LocalResponse } from "@/v2/index.js";
import { ModelSearchResponse } from "@/v2/search/index.js";
import { V2_RESOURCE_PATH } from "../../index.js";

const filePath = path.join(V2_RESOURCE_PATH, "search/models.json");

describe("MindeeV2 - Search Models", () => {
  it("should load search models locally", async () => {
    const localResponse = new LocalResponse(filePath);
    const response = await localResponse.deserializeResponse(ModelSearchResponse);

    assert.ok(response instanceof ModelSearchResponse);

    assert.strictEqual(response.models.length, 5);
    assert.strictEqual(response.pagination.totalItems, 5);
    assert.strictEqual(response.pagination.page, 1);
    assert.strictEqual(response.pagination.perPage, 50);
    assert.strictEqual(response.pagination.totalPages, 1);

    const firstItem = response.models[0];
    assert.strictEqual(firstItem.name, "Extraction With Webhooks");
    assert.strictEqual(firstItem.id, "afde5151-aa11-aa11-9289-fa04e50ca3b9");
    assert.strictEqual(firstItem.modelType, "extraction");

    assert.strictEqual(firstItem.webhooks.length, 2);
    assert.strictEqual(firstItem.webhooks[0].id, "a2286ed9-aa11-aa11-bdc5-2f8496c5641a");
    assert.strictEqual(firstItem.webhooks[0].name, "FAILURE");
    assert.strictEqual(firstItem.webhooks[0].url, "https://failure.mindee.com");

    const lastItem = response.models[response.models.length - 1];
    assert.strictEqual(lastItem.name, "Extraction Without Webhooks Key");
    assert.strictEqual(lastItem.id, "e14e0923-ee55-ee55-a335-8d2110917d7b");
  });
});
