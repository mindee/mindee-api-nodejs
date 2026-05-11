import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { split } from "@/v2/product/index.js";
import { ExtractionResponse } from "@/v2/product/index.js";

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

    const split0: split.SplitRange = splits[0];
    assert.strictEqual(split0.documentType, "receipt");

    assert.ok(Array.isArray(split0.pageRange));
    assert.strictEqual(split0.pageRange.length, 2);
    assert.strictEqual(split0.pageRange[0], 0);
    assert.strictEqual(split0.pageRange[1], 0);
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

    const split0: split.SplitRange = splits[0];
    assert.strictEqual(split0.documentType, "passport");
    assert.ok(Array.isArray(split0.pageRange));
    assert.strictEqual(split0.pageRange.length, 2);
    assert.strictEqual(split0.pageRange[0], 0);
    assert.strictEqual(split0.pageRange[1], 0);

    const split1: split.SplitRange = splits[1];
    assert.strictEqual(split1.documentType, "invoice");
    assert.ok(Array.isArray(split1.pageRange));
    assert.strictEqual(split1.pageRange.length, 2);
    assert.strictEqual(split1.pageRange[0], 1);
    assert.strictEqual(split1.pageRange[1], 3);
  });

  it("should load extraction properties", async () => {
    const response = await loadV2Response(
      split.SplitResponse,
      path.join(V2_PRODUCT_PATH, "split", "default_sample_extraction.json")
    );
    assert.ok(response.inference);

    const splits: split.SplitRange[] = response.inference.result.splits;
    assert.strictEqual(splits.length, 2);

    const split0 = splits[0];
    assert.strictEqual(split0.documentType, "invoice");
    assert.strictEqual(split0.pageRange[0], 0);
    const extractionResponse0: ExtractionResponse = split0.extractionResponse!;
    assert.ok(extractionResponse0);
    assert.strictEqual(
      extractionResponse0.inference.result.fields.getSimpleField("supplier_phone_number").stringValue,
      "05 05 44 44 90"
    );

    const split1 = splits[1];
    assert.strictEqual(split1.documentType, "invoice");
    assert.strictEqual(split1.pageRange[0], 1);
    const extractionResponse1: ExtractionResponse = split1.extractionResponse!;
    assert.ok(extractionResponse1);
    assert.strictEqual(
      extractionResponse1.inference.result.fields.getSimpleField("supplier_phone_number").stringValue,
      "416-555-1212"
    );
  });
});
