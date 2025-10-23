import { expect } from "chai";
import path from "node:path";

import {
  ClientV2,
  InferenceParameters,
  PathInput,
  UrlInput,
  Base64Input,
  InferenceResponse,
} from "../../src";
import { Inference } from "../../src/parsing/v2";
import { SimpleField } from "../../src/parsing/v2/field";
import { MindeeHttpErrorV2 } from "../../src/errors/mindeeError";
import * as fs from "node:fs";

describe("MindeeV2 – Client Integration Tests", () => {
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
  const sampleBase64Path = path.join(
    dataDir,
    "file_types",
    "receipt.txt",
  );

  beforeEach(async () => {
    const apiKey = process.env["MINDEE_V2_API_KEY"] ?? "";
    modelId = process.env["MINDEE_V2_FINDOC_MODEL_ID"] ?? "";

    client = new ClientV2({ apiKey });
  });

  it("Empty, multi-page PDF – PathInput - enqueueAndGetInference must succeed", async () => {
    const source = new PathInput({ inputPath: emptyPdfPath });
    const params: InferenceParameters = {
      modelId,
      rag: false,
      rawText: false,
      polygon: false,
      confidence: false,
      webhookIds: [],
      alias: "ts_integration_empty_multiple"
    };

    const response = await client.enqueueAndGetInference(source, params);

    expect(response).to.exist;
    expect(response.inference).to.be.instanceOf(Inference);
    const inference: Inference = response.inference;

    expect(inference.file?.name).to.equal("multipage_cut-2.pdf");
    expect(inference.file.pageCount).to.equal(2);
    expect(inference.model?.id).to.equal(modelId);

    expect(inference.result).to.exist;
    expect(inference.result.rawText).to.be.undefined;
    expect(inference.activeOptions).to.not.be.null;
    expect(inference.activeOptions?.rag).to.be.false;
    expect(inference.activeOptions?.rawText).to.be.false;
    expect(inference.activeOptions?.polygon).to.be.false;
    expect(inference.activeOptions?.confidence).to.be.false;
  }).timeout(60000);

  it("Filled, single-page image – PathInput - enqueueAndGetInference must succeed", async () => {
    const source = new PathInput({ inputPath: sampleImagePath });
    const params: InferenceParameters = {
      modelId,
      rag: false,
      rawText: true,
      polygon: true,
      confidence: false,
      webhookIds: [],
      alias: "ts_integration_binary_filled_single"
    };

    const response = await client.enqueueAndGetInference(source, params);

    expect(response.inference).to.be.instanceOf(Inference);
    const inference: Inference = response.inference;
    expect(inference.file?.name).to.equal("default_sample.jpg");
    expect(inference.model?.id).to.equal(modelId);

    expect(inference.result).to.exist;
    expect(inference.result.rawText).to.exist;

    const supplierField = inference.result.fields.get("supplier_name") as SimpleField;
    expect(supplierField).to.be.instanceOf(SimpleField);
    expect(supplierField.value).to.equal("John Smith");

    expect(inference.result.rawText).to.exist;
    expect(inference.activeOptions).to.not.be.null;
    expect(inference.activeOptions?.rag).to.be.false;
    expect(inference.activeOptions?.rawText).to.be.true;
    expect(inference.activeOptions?.polygon).to.be.true;
    expect(inference.activeOptions?.confidence).to.be.false;

    expect(inference.result.rawText?.pages).to.have.lengthOf(1);
  }).timeout(120000);

  it("Filled, single-page image – Base64Input - enqueueAndGetInference must succeed", async () => {
    const data = fs.readFileSync(sampleBase64Path, "utf8");
    const source = new Base64Input({ inputString: data, filename: "receipt.jpg" });
    const params: InferenceParameters = {
      modelId,
      rag: false,
      rawText: false,
      polygon: false,
      confidence: false,
      webhookIds: [],
      alias: "ts_integration_base64_filled_single"
    };

    const response = await client.enqueueAndGetInference(source, params);

    expect(response.inference).to.be.instanceOf(Inference);
    const inference: Inference = response.inference;
    expect(inference.file?.name).to.equal("receipt.jpg");
    expect(inference.model?.id).to.equal(modelId);

    expect(inference.result).to.exist;
    expect(inference.result.rawText).to.be.undefined;

    const supplierField = inference.result.fields.get("supplier_name") as SimpleField;
    expect(supplierField).to.be.instanceOf(SimpleField);
    expect(supplierField.value).to.equal("Clachan");

    expect(inference.activeOptions).to.not.be.null;
    expect(inference.activeOptions?.rag).to.be.false;
    expect(inference.activeOptions?.rawText).to.be.false;
    expect(inference.activeOptions?.polygon).to.be.false;
    expect(inference.activeOptions?.confidence).to.be.false;
  }).timeout(120000);

  it("Invalid model ID – enqueue must raise 422", async () => {
    const source = new PathInput({ inputPath: emptyPdfPath });
    const badParams: InferenceParameters = { modelId: "00000000-0000-0000-0000-000000000000" };

    try {
      await client.enqueueInference(source, badParams);
      expect.fail("Expected the call to throw, but it succeeded.");
    } catch (err) {
      expect(err).to.be.instanceOf(MindeeHttpErrorV2);
      const errObj = err as MindeeHttpErrorV2;
      expect(errObj.status).to.equal(422);
      expect(errObj.code.startsWith("422-")).to.be.true;
      expect(errObj.title).to.be.a("string");
      expect(errObj.detail).to.be.a("string");
    }
  }).timeout(60000);

  it("Invalid job ID – getInference must raise 422", async () => {
    try {
      await client.getInference("00000000-0000-0000-0000-000000000000");
      expect.fail("Expected the call to throw, but it succeeded.");
    } catch (err) {
      expect(err).to.be.instanceOf(MindeeHttpErrorV2);
      const errObj = err as MindeeHttpErrorV2;
      expect(errObj.status).to.equal(422);
      expect(errObj.code.startsWith("422-")).to.be.true;
      expect(errObj.title).to.be.a("string");
      expect(errObj.detail).to.be.a("string");
    }
  }).timeout(60000);

  it("HTTPS URL – enqueue & get inference must succeed", async () => {
    const url = process.env.MINDEE_V2_SE_TESTS_BLANK_PDF_URL ?? "error-no-url-found";
    const source = new UrlInput({ url });
    const params: InferenceParameters = {
      modelId,
      rag: false,
      rawText: false,
      polygon: false,
      confidence: false,
      webhookIds: [],
      alias: "ts_integration_url_source"
    };

    const response: InferenceResponse = await client.enqueueAndGetInference(source, params);

    expect(response).to.exist;
    expect(response.inference).to.be.instanceOf(Inference);
  }).timeout(60000);

});
