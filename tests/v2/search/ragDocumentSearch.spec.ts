import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "path";
import { V2_RESOURCE_PATH } from "../../index.js";
import { LocalResponse } from "@/v2/index.js";
import { RagDocumentSearchResponse } from "@/v2/parsing/search/index.js";

const filePath = path.join(V2_RESOURCE_PATH, "search/rag_documents.json");

describe("MindeeV2 - Search RAG Documents", () => {
  it("should load search RAG Documents locally", async () => {
    const localResponse = new LocalResponse(filePath);
    const response = await localResponse.deserializeResponse(RagDocumentSearchResponse);

    assert.ok(response instanceof RagDocumentSearchResponse);

    assert.strictEqual(response.ragDocuments.length, 3);
    assert.strictEqual(response.pagination.totalItems, 3);
    assert.strictEqual(response.pagination.page, 1);
    assert.strictEqual(response.pagination.perPage, 50);
    assert.strictEqual(response.pagination.totalPages, 1);

    const firstItem = response.ragDocuments[0];
    assert.strictEqual(firstItem.id, "cc831599-c545-48b7-aa27-6d7ccd5b8d32");
    assert.strictEqual(firstItem.modelId, "12345678-1234-1234-1234-123456789abc");
    assert.strictEqual(firstItem.filename, "invoice_01.pdf");
    assert.deepStrictEqual(firstItem.createdAt, new Date("2026-06-30T13:13:46.168586Z"));
    assert.strictEqual(firstItem.totalMatches, 0);
    assert.strictEqual(firstItem.lastMatchAt, undefined);
    assert.strictEqual(firstItem.status, "Processing");

    const secondItem = response.ragDocuments[1];
    assert.strictEqual(secondItem.id, "27467e4c-5602-4315-90d9-3d2da69b05ab");
    assert.strictEqual(secondItem.modelId, "12345678-1234-1234-1234-123456789abc");
    assert.strictEqual(secondItem.filename, "invoice_02.pdf");
    assert.deepStrictEqual(secondItem.createdAt, new Date("2026-06-30T13:13:46.168586Z"));
    assert.strictEqual(secondItem.totalMatches, 0);
    assert.strictEqual(secondItem.lastMatchAt, undefined);
    assert.strictEqual(secondItem.status, "Draft");

    const thirdItem = response.ragDocuments[2];
    assert.strictEqual(thirdItem.id, "a6bcae7d-0439-476b-8a63-5a39ec05dc21");
    assert.strictEqual(thirdItem.modelId, "12345678-1234-1234-1234-jobid1234567");
    assert.strictEqual(thirdItem.filename, "invoice_03.pdf");
    assert.deepStrictEqual(thirdItem.createdAt, new Date("2026-06-17T14:35:46.228006Z"));
    assert.strictEqual(thirdItem.totalMatches, 5);
    assert.deepStrictEqual(thirdItem.lastMatchAt, new Date("2026-06-18T14:35:46.248006Z"));
    assert.strictEqual(thirdItem.status, "Active");
  });
});
