import { expect } from "chai";
import path from "node:path";

import { ClientV2, InferenceParameters } from "../../src";
import { PathInput, UrlInput } from "../../src/input";
import { SimpleField } from "../../src/parsing/v2/field";
import { MindeeHttpErrorV2 } from "../../src/errors/mindeeError";

describe("MindeeClientV2 – integration tests (V2)", () => {
  let client: ClientV2;
  let modelId: string;

  const dataDir = path.join(__dirname, "..", "data");
  const emptyPdfPath = path.join(
    dataDir,
    "file_types",
    "pdf",
    "multipage_cut-2.pdf",
  );
  const sampleImagePath = path.join(
    dataDir,
    "products",
    "financial_document",
    "default_sample.jpg",
  );

  beforeEach(async () => {
    const apiKey = process.env["MINDEE_V2_API_KEY"] ?? "";
    modelId = process.env["MINDEE_V2_FINDOC_MODEL_ID"] ?? "";

    client = new ClientV2({ apiKey });
  });

  it("Empty, multi-page PDF – enqueue & parse must succeed", async () => {
    const source = new PathInput({ inputPath: emptyPdfPath });
    const params: InferenceParameters = { modelId };

    const response = await client.enqueueAndGetInference(source, params);

    expect(response).to.exist;
    const inf = response.inference;
    expect(inf).to.exist;

    expect(inf.file?.name).to.equal("multipage_cut-2.pdf");
    expect(inf.model?.id).to.equal(modelId);

    expect(inf.result).to.exist;
    expect(inf.result.options).to.be.undefined;
  }).timeout(60000);

  it("Filled, single-page image – enqueue & parse must succeed", async () => {
    const source = new PathInput({ inputPath: sampleImagePath });
    const params: InferenceParameters = { modelId, rag: false };

    const response = await client.enqueueAndGetInference(source, params);

    const inf = response.inference;
    expect(inf.file?.name).to.equal("default_sample.jpg");
    expect(inf.model?.id).to.equal(modelId);

    const supplierField = inf.result.fields.get("supplier_name") as SimpleField;
    expect(supplierField).to.be.instanceOf(SimpleField);
    expect(supplierField.value).to.equal("John Smith");
  }).timeout(60000);

  it("Invalid model ID – enqueue must raise 422", async () => {
    const source = new PathInput({ inputPath: emptyPdfPath });
    const badParams: InferenceParameters = { modelId: "INVALID MODEL ID" };

    try {
      await client.enqueueInference(source, badParams);
      expect.fail("Expected the call to throw, but it succeeded.");
    } catch (err) {
      expect(err).to.be.instanceOf(MindeeHttpErrorV2);
      expect((err as MindeeHttpErrorV2).status).to.equal(422);
    }
  }).timeout(60000);

  it("Invalid job ID – getInference must raise 404", async () => {
    try {
      await client.getInference("00000000-0000-0000-0000-000000000000");
      expect.fail("Expected the call to throw, but it succeeded.");
    } catch (err) {
      expect(err).to.be.instanceOf(MindeeHttpErrorV2);
      expect((err as MindeeHttpErrorV2).status).to.equal(422);
    }
  }).timeout(60000);

  it("HTTPS URL – enqueue & parse must succeed", async () => {
    const url = process.env.MINDEE_V2_SE_TESTS_BLANK_PDF_URL ?? "error-no-url-found";
    const source = new UrlInput({ url });
    const params: InferenceParameters = { modelId };

    const response = await client.enqueueAndGetInference(source, params);

    expect(response).to.exist;
    expect(response.inference).to.exist;
  }).timeout(60000);

});
