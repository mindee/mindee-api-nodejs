import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "path";
import * as fs from "node:fs/promises";
import { FeedbackResponse } from "@/v1/parsing/common/index.js";
import { V1_PRODUCT_PATH } from "../../index.js";

describe("MindeeV1 - Feedback response", () => {
  it("should load an empty feedback response", async () => {
    const jsonData = await fs.readFile(
      path.join(V1_PRODUCT_PATH, "invoices/feedback_response/empty.json")
    );
    const feedbackResponse: FeedbackResponse = new FeedbackResponse(JSON.parse(jsonData.toString()));
    assert.ok(feedbackResponse.feedback);
    assert.strictEqual(feedbackResponse.feedback.customer_address, null);
  });
});
