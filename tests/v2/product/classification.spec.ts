import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ClassificationResponse } from "@/v2/product/index.js";

import { V2_PRODUCT_PATH } from "../../index.js";
import { loadV2Response } from "./utils.js";


describe("MindeeV2 - Classification Response", async () => {
  it("should load a single result", async () => {
    const response = await loadV2Response(
      ClassificationResponse,
      path.join(V2_PRODUCT_PATH, "classification", "classification_single.json")
    );
    const inference = response.inference;

    const model = inference.model;
    assert.notStrictEqual(model, undefined);

    const classification = inference.result.classification;
    assert.strictEqual(classification.documentType, "invoice");
  });
});
