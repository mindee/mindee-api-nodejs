import nock from "nock";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../src/";

describe("HTTP calls", () => {
  before(function() {
    process.env.MINDEE_API_HOST = "local.mindee.net";
  });

  after(function() {
    delete process.env.MINDEE_API_HOST;
  });

  async function sendRequest(httpCode: number, httpResultFile: string) {
    const owner = "mindee";
    const urlName = "invoices";
    const version = "4";

    nock("https://local.mindee.net")
      .post(`/v1/products/${owner}/${urlName}/v${version}/predict`)
      .replyWithFile(httpCode, path.resolve(httpResultFile));

    const mindeeClient = new mindee.Client({ apiKey: "my-api-key", debug: true });
    const doc = mindeeClient.docFromPath(path.resolve("tests/data/file_types/pdf/blank_1.pdf"));

    return await mindeeClient.parse(mindee.product.InvoiceV4, doc);
  }

  it("should fail on 400 response with object", async () => {
    try {
      await sendRequest(400, path.resolve("tests/data/errors/error_400_with_object_in_detail.json"));
    } catch (error: any) {
      expect(error.name).to.be.equals("MindeeHttp400Error");
      expect(error.code).to.be.equals(400);
      expect(error.message).to.be.undefined;
      expect(error.details).to.deep.equal({ document: ["error message"] });
    }
  });

  it("should fail on 401 response", async () => {
    try {
      await sendRequest(401, path.resolve("tests/data/errors/error_401_no_token.json"));
    } catch (error: any) {
      expect(error.name).to.be.equals("MindeeHttp401Error");
      expect(error.code).to.be.equals(401);
      expect(error.message).to.be.equals("Authorization required");
      expect(error.details).to.be.equals("No token provided");
    }
  });

  it("should fail on 429 response", async () => {
    try {
      await sendRequest(429, path.resolve("tests/data/errors/error_429_too_many_requests.json"));
    } catch (error: any) {
      expect(error.name).to.be.equals("MindeeHttp429Error");
      expect(error.code).to.be.equals(429);
      expect(error.message).to.be.equals("Too many requests");
      expect(error.details).to.be.equals("Too Many Requests.");
    }
  });
  it("should fail on 500 response", async () => {
    try {
      await sendRequest(500, path.resolve("tests/data/errors/error_500_inference_fail.json"));
    } catch (error: any) {
      expect(error.name).to.be.equals("MindeeHttp500Error");
      expect(error.code).to.be.equals(500);
      expect(error.details).to.be.equals("Can not run prediction: ");
      expect(error.message).to.be.equals("Inference failed");
    }
  });

  it("should fail on HTML response", async () => {
    try {
      await sendRequest(500, path.resolve("tests/data/errors/error_50x.html"));
    } catch (error: any) {
      expect(error.name).to.be.equals("MindeeHttp500Error");
      expect(error.code).to.be.equals(500);
    }
  });
});

describe ("Endpoint parameters" , () => {
  it ("should initialize default parameters properly", async () => {
    const mindeeClient = new mindee.Client({ apiKey: "dummy-api-key" });
    const customEndpoint = mindeeClient.createEndpoint(
      "dummy-endpoint",
      "dummy-account"
    );
    expect(customEndpoint.version).to.equal("1");
    expect(customEndpoint.settings.timeout).to.equal(120);
    expect(customEndpoint.settings.hostname).to.equal("api.mindee.net");
    expect(customEndpoint.settings.apiKey).to.equal("dummy-api-key");
  });

  it ("should initialize environment parameters properly", async () => {
    process.env.MINDEE_API_HOST = "dummy-host";
    process.env.MINDEE_API_KEY = "dummy-key";
    process.env.MINDEE_REQUEST_TIMEOUT = "30";
    const mindeeClient = new mindee.Client();
    const customEndpoint = mindeeClient.createEndpoint(
      "dummy-endpoint",
      "dummy-account"
    );
    expect(customEndpoint.version).to.equal("1");
    expect(customEndpoint.settings.timeout).to.equal(30);
    expect(customEndpoint.settings.hostname).to.equal("dummy-host");
    expect(customEndpoint.settings.apiKey).to.equal("dummy-key");

    delete process.env.MINDEE_API_HOST;
    delete process.env.MINDEE_API_KEY;
  });
});
