import path from "path";
import { expect } from "chai";
import { promises as fs } from "fs";
import { FeedbackResponse } from "../../src/parsing/common";

describe("Feedback response", () => {
  it("should load an empty feedback response", async () => {
    const jsonData = await fs.readFile(
      path.resolve("tests/data/products/invoices/feedback_response/empty.json")
    );
    const feedbackResponse: FeedbackResponse = new FeedbackResponse(JSON.parse(jsonData.toString()));
    expect(feedbackResponse.feedback).to.not.be.undefined;
    expect(feedbackResponse.feedback.customer_address).to.be.null;
  });
});
