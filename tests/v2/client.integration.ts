import { expect } from "chai";
import path from "node:path";

import {
  Client,
  PathInput,
  UrlInput,
  Base64Input,
} from "@/index.js";
import {
  ExtractionInference,
  ExtractionParameters,
  ExtractionResponse,
} from "@/v2/product/extraction/index.js";
import { SimpleField } from "@/v2/parsing/inference/field/index.js";
import { MindeeHttpErrorV2 } from "@/v2/http/index.js";
import * as fs from "node:fs";
import { RESOURCE_PATH, V2_PRODUCT_PATH, V2_RESOURCE_PATH } from "../index.js";
import { Extraction } from "@/v2/product/index.js";

function check422(err: unknown) {
  expect(err).to.be.instanceOf(MindeeHttpErrorV2);
  const errObj = err as MindeeHttpErrorV2;
  expect(errObj.status).to.equal(422);
  expect(errObj.code.startsWith("422-")).to.be.true;
  expect(errObj.title).to.be.a("string");
  expect(errObj.detail).to.be.a("string");
  expect(errObj.errors).to.be.instanceOf(Array);
}

function checkEmptyActiveOptions(inference: ExtractionInference) {
  expect(inference.activeOptions).to.not.be.null;
  expect(inference.activeOptions?.rag).to.be.false;
  expect(inference.activeOptions?.rawText).to.be.false;
  expect(inference.activeOptions?.polygon).to.be.false;
  expect(inference.activeOptions?.confidence).to.be.false;
  expect(inference.activeOptions?.textContext).to.be.false;
}

describe("MindeeV2 – Client Integration Tests", () => {
  let client: Client;
  let modelId: string;

  const emptyPdfPath = path.join(
    RESOURCE_PATH,
    "file_types",
    "pdf",
    "multipage_cut-2.pdf",
  );
  const sampleImagePath = path.join(
    V2_PRODUCT_PATH,
    "financial_document",
    "default_sample.jpg",
  );
  const sampleBase64Path = path.join(
    RESOURCE_PATH,
    "file_types",
    "receipt.txt",
  );
  const dataSchemaReplacePath = path.join(
    V2_RESOURCE_PATH, "inference/data_schema_replace_param.json"
  );
  let dataSchemaReplace: string;

  beforeEach(async () => {
    const apiKey = process.env["MINDEE_V2_API_KEY"] ?? "";
    modelId = process.env["MINDEE_V2_FINDOC_MODEL_ID"] ?? "";

    client = new Client({ apiKey: apiKey, debug: true });
  });
  before(async () => {
    dataSchemaReplace = fs.readFileSync(dataSchemaReplacePath).toString();
  });

  it("Empty, multi-page PDF – PathInput - enqueueAndGetInference must succeed", async () => {
    const source = new PathInput({ inputPath: emptyPdfPath });
    const params = {
      modelId,
      rag: false,
      rawText: false,
      polygon: false,
      confidence: false,
      webhookIds: [],
      alias: "ts_integration_empty_multiple"
    };
    const response = await client.enqueueAndGetResult(
      Extraction, source, params
    );
    expect(response).to.exist;
    expect(response.inference).to.be.instanceOf(ExtractionInference);
    const inference: ExtractionInference = response.inference;

    expect(inference.file?.name).to.equal("multipage_cut-2.pdf");
    expect(inference.file.pageCount).to.equal(2);
    expect(inference.model?.id).to.equal(modelId);

    expect(inference.result).to.exist;
    expect(inference.result.rawText).to.be.undefined;
    checkEmptyActiveOptions(inference);
  }).timeout(60000);

  it("Filled, single-page image – PathInput - enqueueAndGetInference must succeed", async () => {
    const source = new PathInput({ inputPath: sampleImagePath });
    const params = {
      modelId,
      rag: false,
      rawText: true,
      polygon: true,
      confidence: false,
      textContext: "this is an invoice",
      webhookIds: [],
      alias: "ts_integration_binary_filled_single"
    };

    const response = await client.enqueueAndGetResult(
      Extraction, source, params
    );
    expect(response.inference).to.be.instanceOf(ExtractionInference);
    const inference: ExtractionInference = response.inference;
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
    expect(inference.activeOptions?.textContext).to.be.true;

    expect(inference.result.rawText?.pages).to.have.lengthOf(1);
  }).timeout(120000);

  it("Filled, single-page image – Base64Input - enqueueAndGetInference must succeed", async () => {
    const data = fs.readFileSync(sampleBase64Path, "utf8");
    const source = new Base64Input({ inputString: data, filename: "receipt.jpg" });
    const params = {
      modelId,
      rag: false,
      rawText: false,
      polygon: false,
      confidence: false,
      webhookIds: [],
      alias: "ts_integration_base64_filled_single"
    };

    const response = await client.enqueueAndGetResult(
      Extraction, source, params
    );
    expect(response.inference).to.be.instanceOf(ExtractionInference);
    const inference: ExtractionInference = response.inference;
    expect(inference.file?.name).to.equal("receipt.jpg");
    expect(inference.model?.id).to.equal(modelId);

    expect(inference.result).to.exist;
    expect(inference.result.rawText).to.be.undefined;

    const supplierField = inference.result.fields.get("supplier_name") as SimpleField;
    expect(supplierField).to.be.instanceOf(SimpleField);
    expect(supplierField.value).to.equal("Clachan");

    checkEmptyActiveOptions(inference);
  }).timeout(120000);

  it("Invalid model ID – enqueue must raise 422", async () => {
    const source = new PathInput({ inputPath: emptyPdfPath });
    const badParams = { modelId: "00000000-0000-0000-0000-000000000000" };

    try {
      await client.enqueue(Extraction, source, badParams);
      expect.fail("Expected the call to throw, but it succeeded.");
    } catch (err) {
      check422(err);
    }
  }).timeout(60000);

  it("Invalid job ID – getInference must raise 422", async () => {
    try {
      await client.getResult(
        Extraction,
        "00000000-0000-0000-0000-000000000000"
      );
      expect.fail("Expected the call to throw, but it succeeded.");
    } catch (err) {
      check422(err);
    }
  }).timeout(60000);

  it("HTTPS URL – enqueue & get inference must succeed", async () => {
    const url = process.env.MINDEE_V2_SE_TESTS_BLANK_PDF_URL ?? "error-no-url-found";
    const source = new UrlInput({ url });
    const params = new ExtractionParameters({
      modelId,
      rag: false,
      rawText: false,
      polygon: false,
      confidence: false,
      webhookIds: [],
      alias: "ts_integration_url_source"
    });
    const response: ExtractionResponse = await client.enqueueAndGetResult(
      Extraction, source, params
    );
    expect(response).to.exist;
    expect(response.inference).to.be.instanceOf(ExtractionInference);
  }).timeout(60000);

  it("Data Schema Override - Overrides the data schema successfully", async () => {
    const source = new PathInput({ inputPath: emptyPdfPath });
    const params = new ExtractionParameters({
      modelId,
      rag: false,
      rawText: false,
      confidence: false,
      polygon: false,
      webhookIds: [],
      dataSchema: dataSchemaReplace,
      alias: "ts_integration_data_schema_replace"
    });
    const response = await client.enqueueAndGetResult(
      Extraction, source, params
    );
    expect(response).to.exist;
    expect(response.inference).to.be.instanceOf(ExtractionInference);
    expect(response.inference.result.fields.get("test_replace")).to.exist;
    expect((response.inference.result.fields.get("test_replace") as SimpleField).value).to.be.equals("a test value");

  }).timeout(60000);

});
