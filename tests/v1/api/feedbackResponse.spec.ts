import path from "path";
import { expect } from "chai";
import { promises as fs } from "fs";
import { FeedbackResponse } from "../../../src/parsing/common";
import { V1_PRODUCT_PATH } from "../../index";

describe("MindeeV1 - Feedback response", () => {
  it("should load an empty feedback response", async () => {
    const jsonData = await fs.readFile(
      path.join(V1_PRODUCT_PATH, "invoices/feedback_response/empty.json")
    );
    const feedbackResponse: FeedbackResponse = new FeedbackResponse(JSON.parse(jsonData.toString()));
    expect(feedbackResponse.feedback).to.not.be.undefined;
    expect(feedbackResponse.feedback.customer_address).to.be.null;
  });
});
