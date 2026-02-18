import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { split } from "@/v2/product/index.js";

import { V2_PRODUCT_PATH } from "../../index.js";
import { loadV2Response } from "./utils.js";

describe("MindeeV2 - Split Response", async () => {
  it("should load a single result", async () => {
    const response = await loadV2Response(
      split.SplitResponse,
      path.join(V2_PRODUCT_PATH, "split", "split_single.json")
    );
    const inference = response.inference;

    const model = inference.model;
    assert.notStrictEqual(model, undefined);

    const splits: split.SplitRange[] = inference.result.splits;
    assert.ok(Array.isArray(splits));
    assert.strictEqual(splits.length, 1);

    const firstSplit: split.SplitRange = splits[0];
    assert.strictEqual(firstSplit.documentType, "receipt");

    assert.ok(Array.isArray(firstSplit.pageRange));
    assert.strictEqual(firstSplit.pageRange.length, 2);
    assert.strictEqual(firstSplit.pageRange[0], 0);
    assert.strictEqual(firstSplit.pageRange[1], 0);
  });

  it("should load multiple results", async () => {
    const response = await loadV2Response(
      split.SplitResponse,
      path.join(V2_PRODUCT_PATH, "split", "split_multiple.json")
    );
    const inference = response.inference;

    const model = inference.model;
    assert.notStrictEqual(model, undefined);

    const splits: split.SplitRange[] = inference.result.splits;
    assert.ok(Array.isArray(splits));
    assert.strictEqual(splits.length, 3);

    const firstSplit: split.SplitRange = splits[0];
    assert.strictEqual(firstSplit.documentType, "invoice");
    assert.ok(Array.isArray(firstSplit.pageRange));
    assert.strictEqual(firstSplit.pageRange.length, 2);
    assert.strictEqual(firstSplit.pageRange[0], 0);
    assert.strictEqual(firstSplit.pageRange[1], 0);

    const secondSplit: split.SplitRange = splits[1];
    assert.strictEqual(secondSplit.documentType, "invoice");
    assert.ok(Array.isArray(secondSplit.pageRange));
    assert.strictEqual(secondSplit.pageRange.length, 2);
    assert.strictEqual(secondSplit.pageRange[0], 1);
    assert.strictEqual(secondSplit.pageRange[1], 3);
  });
});
