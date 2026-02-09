import { expect } from "chai";
import path from "node:path";
import { ClassificationResponse } from "@/v2/product/index.js";

import { V2_PRODUCT_PATH } from "../../index.js";
import { loadV2Response } from "./utils.js";


describe("MindeeV2 - Classification Response", async () => {
  it("should load a single result", async () => {
    const response = await loadV2Response(
      ClassificationResponse,
      path.join(V2_PRODUCT_PATH, "classification", "classification_single.json")
    );
    const classification = response.inference.result.classification;
    expect(classification.documentType).to.equal("invoice");
  });
});
