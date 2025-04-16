import * as mindee from "../../src";
import { ExecutionPriority } from "../../src/parsing/common";
import { expect } from "chai";

describe("Workflow calls", () => {
  let client: mindee.Client;
  beforeEach(() => {
    client = new mindee.Client();
  });
  it("should retrieve a correct response from the API.", async () => {
    const sample = client.docFromPath(
      "tests/data/products/financial_document/default_sample.jpg"
    );
    await sample.init();
    const currentDateTime = new Date().toISOString().replace(/T/, "-").replace(/\..+/, "");
    const response = await client.executeWorkflow(
      sample,
      process.env["WORKFLOW_ID"] ?? "",
      { alias: `node-${currentDateTime}`, priority: ExecutionPriority.low, rag: true });
    expect(response.execution.priority).to.equal(ExecutionPriority.low);
    expect(response.execution.file.alias).to.equal(`node-${currentDateTime}`);
  }).timeout(60000);
});
