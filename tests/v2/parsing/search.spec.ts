import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { LocalResponse, SearchResponse } from "@/v2/index.js";
import { V2_RESOURCE_PATH } from "../../index.js";

const searchPath = path.join(V2_RESOURCE_PATH, "search");

async function loadSearchResponse(resourcePath: string): Promise<SearchResponse> {
  const localResponse = new LocalResponse(resourcePath);
  await localResponse.init();
  return localResponse.deserializeResponse(SearchResponse);
}

describe("MindeeV2 - Search Models Response", async () => {
  it("should load a search response with models and pagination", async () => {
    const response = await loadSearchResponse(
      path.join(searchPath, "models.json")
    );

    assert.ok(response);
    assert.strictEqual(response.models.length, 5);
    assert.strictEqual(response.pagination.totalItems, 5);
    assert.strictEqual(response.pagination.page, 1);
    assert.strictEqual(response.pagination.perPage, 50);
    assert.strictEqual(response.pagination.totalPages, 1);

    const first = response.models[0];
    assert.strictEqual(first.name, "Extraction With Webhooks");
    assert.strictEqual(first.id, "afde5151-aa11-aa11-9289-fa04e50ca3b9");
    assert.strictEqual(first.modelType, "extraction");
    assert.strictEqual(first.webhooks.length, 2);
    assert.strictEqual(first.webhooks[0].id, "a2286ed9-aa11-aa11-bdc5-2f8496c5641a");
    assert.strictEqual(first.webhooks[0].name, "FAILURE");
    assert.strictEqual(first.webhooks[0].url, "https://failure.mindee.com");

    const last = response.models[response.models.length - 1];
    assert.strictEqual(last.name, "Extraction Without Webhooks Key");
    assert.strictEqual(last.id, "e14e0923-ee55-ee55-a335-8d2110917d7b");
    assert.deepStrictEqual(last.webhooks, []);
  });

  it("should render a human-readable summary", async () => {
    const response = await loadSearchResponse(
      path.join(searchPath, "models.json")
    );
    const rendered = response.toString();

    assert.match(rendered, /^Models\n######\n/);
    assert.match(rendered, /\* :Name: Extraction With Webhooks/);
    assert.match(rendered, /:ID: afde5151-aa11-aa11-9289-fa04e50ca3b9/);
    assert.match(rendered, /:Model Type: extraction/);
    assert.match(rendered, /Pagination Metadata\n###################\n/);
    assert.match(rendered, /:Per Page: 50/);
    assert.match(rendered, /:Page: 1/);
    assert.match(rendered, /:Total Items: 5/);
    assert.match(rendered, /:Total Pages: 1/);
  });

  it("should expose the raw HTTP payload", async () => {
    const response = await loadSearchResponse(
      path.join(searchPath, "models.json")
    );
    const raw = response.getRawHttp();
    assert.ok(Array.isArray(raw["models"]));
    assert.strictEqual(raw["models"].length, 5);
  });

  it("should handle empty models gracefully via direct instantiation", () => {
    const response = new SearchResponse(
      JSON.parse(
        '{"models":[],"pagination":{"per_page":50,"page":1,"total_items":0,"total_pages":0}}'
      )
    );
    assert.strictEqual(response.models.length, 0);
    assert.strictEqual(response.pagination.totalItems, 0);
    assert.match(response.toString(), /Models\n######\n\n/);
  });
});
