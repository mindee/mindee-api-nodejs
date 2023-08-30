const nock = require('nock');
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../src/";

process.env["MINDEE_API_HOST"] = "local.mindee.net";

describe("HTTP calls", () => {

  async function sendRequest(http_code: number, http_result_file: string) {
    const owner = "mindee";
    const urlName = "invoices";
    const version = "4";

    nock("https://local.mindee.net")
      .post(`/v1/products/${owner}/${urlName}/v${version}/predict`)
      .replyWithFile(http_code, path.resolve(http_result_file));

    const mindeeClient = new mindee.Client({ apiKey: "my-api-key", debug: true});
    const doc = mindeeClient.docFromPath(path.resolve("tests/data/file_types/pdf/blank_1.pdf"));

    return await mindeeClient.parse(mindee.product.InvoiceV4, doc);
  }

  it("should fail on HTML response", async () => {
    try {
      await sendRequest(413, path.resolve("tests/data/errors/error_50x.html"));
    } catch (error: any) {
      expect(error.name).to.be.equals("MindeeHttp413Error");
      expect(error.code).to.be.equals(413);
    }
  });

  it("should fail on 401 response", async () => {
    try {
      await sendRequest(401, path.resolve("tests/data/errors/error_401_from_mindeeapi.json"));
    } catch (error: any) {
      expect(error.name).to.be.equals("MindeeHttp401Error");
      expect(error.code).to.be.equals(401);
      expect(error.message).to.be.equals("Authorization required");
      expect(error.details).to.be.equals("No token provided");
    }
  });

  it("should fail on 429 response", async () => {
    try {
      await sendRequest(429, path.resolve("tests/data/errors/error_429_from_mindeeapi.json"));
    } catch (error: any) {
      expect(error.name).to.be.equals("MindeeHttp429Error");
      expect(error.code).to.be.equals(429);
      expect(error.message).to.be.equals("Too many requests");
      expect(error.details).to.be.equals("Too Many Requests.");
    }
  });
});
