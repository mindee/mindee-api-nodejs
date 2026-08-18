import { describe } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@/v2/index.js";
import { beforeEach } from "node:test";
import { it } from "node:test";
import { RagDocumentSearch, RagDocumentSearchResponse } from "@/v2/search/index.js";

describe("MindeeV2 - Integration - RAG Document Search", { timeout: 120000 }, () => {
  let client: Client;
  let findocModelId: string;

  beforeEach(() => {
    const apiKey = process.env["MINDEE_V2_API_KEY"] ?? "";
    findocModelId = process.env["MINDEE_V2_SE_TESTS_FINDOC_MODEL_ID"] ?? "";

    client = new Client({ apiKey: apiKey, debug: true });
  });

  it("RAG Document search must have results", async () => {
    const response: RagDocumentSearchResponse = await client.search(RagDocumentSearch, { modelId: findocModelId });
    assert.ok(response);
    assert.ok(response.ragDocuments.length > 0);
    assert.ok(response.pagination);
    assert.ok(response.pagination.totalItems >= 1);
    assert.equal(response.pagination.page, 1);
  });
});
