import { before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { setTimeout } from "node:timers/promises";

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
import { RESOURCE_PATH, V2_PRODUCT_PATH } from "../../index.js";
import { Extraction } from "@/v2/product/index.js";

/**
 * Check if an error is a MindeeHttpErrorV2.
 * @param err Error to check.
 */
function check422(err: unknown) {
  assert.ok(err instanceof MindeeHttpErrorV2);
  const errObj = err as MindeeHttpErrorV2;
  assert.equal(errObj.status, 422);
  assert.ok(errObj.code.startsWith("422-"));
  assert.equal(typeof errObj.title, "string");
  assert.equal(typeof errObj.detail, "string");
  assert.ok(Array.isArray(errObj.errors));
}

/**
 * Check if an inference has empty active options.
 * @param inference Inference to check.
 */
function checkEmptyActiveOptions(inference: ExtractionInference) {
  assert.notStrictEqual(inference.activeOptions, null);
  assert.equal(inference.activeOptions?.rag, false);
  assert.equal(inference.activeOptions?.rawText, false);
  assert.equal(inference.activeOptions?.polygon, false);
  assert.equal(inference.activeOptions?.confidence, false);
  assert.equal(inference.activeOptions?.textContext, false);
}

/**
 * Polls a job until a result URL is available, or fails after a fixed number of attempts.
 * @param client Client used for polling.
 * @param jobId Job ID to poll.
 * @param maxAttempts Maximum poll attempts.
 * @param delayMs Delay between attempts in milliseconds.
 * @returns The result URL once available.
 */
async function waitForResultUrl(
  client: Client,
  jobId: string,
  maxAttempts = 60,
  delayMs = 2000,
): Promise<string> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const jobResponse = await client.getJob(jobId);
    if (jobResponse.job.resultUrl) {
      return jobResponse.job.resultUrl;
    }
    if (attempt < maxAttempts) {
      await setTimeout(delayMs);
    }
  }
  throw new Error(
    `Job ${jobId} did not return a result URL after ${maxAttempts} attempts` +
    ` (${Math.floor((maxAttempts * delayMs) / 1000)} seconds).`
  );
}

describe("MindeeV2 – Integration - Client", { timeout: 120000 }, () => {
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
    "extraction",
    "financial_document",
    "default_sample.jpg",
  );
  const sampleBase64Path = path.join(
    RESOURCE_PATH,
    "file_types",
    "receipt.txt",
  );
  const dataSchemaReplacePath = path.join(
    V2_PRODUCT_PATH, "extraction/data_schema_replace_param.json"
  );
  let dataSchemaReplace: string;

  beforeEach(async () => {
    const apiKey = process.env["MINDEE_V2_API_KEY"] ?? "";
    modelId = process.env["MINDEE_V2_SE_TESTS_FINDOC_MODEL_ID"] ?? "";

    client = new Client({ apiKey: apiKey, debug: true });
  });
  before(async () => {
    dataSchemaReplace = fs.readFileSync(dataSchemaReplacePath).toString();
  });

  it("enqueueAndGetResult must succeed: Empty, multi-page PDF – PathInput", async () => {
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
    assert.ok(response);
    assert.ok(response.inference instanceof ExtractionInference);
    const inference: ExtractionInference = response.inference;

    assert.equal(inference.file?.name, "multipage_cut-2.pdf");
    assert.equal(inference.file.pageCount, 2);
    assert.equal(inference.model?.id, modelId);

    assert.ok(inference.result);
    assert.equal(inference.result.rawText, undefined);
    checkEmptyActiveOptions(inference);
  });

  it("enqueueAndGetResult must succeed: Filled, single-page image – PathInput", async () => {
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
    assert.ok(response.inference instanceof ExtractionInference);
    const inference: ExtractionInference = response.inference;
    assert.equal(inference.file?.name, "default_sample.jpg");
    assert.equal(inference.model?.id, modelId);

    assert.ok(inference.result);
    assert.ok(inference.result.rawText);

    const supplierField = inference.result.fields.get("supplier_name") as SimpleField;
    assert.ok(supplierField instanceof SimpleField);
    assert.equal(supplierField.value, "John Smith");

    assert.ok(inference.result.rawText);
    assert.notStrictEqual(inference.activeOptions, null);
    assert.equal(inference.activeOptions?.rag, false);
    assert.equal(inference.activeOptions?.rawText, true);
    assert.equal(inference.activeOptions?.polygon, true);
    assert.equal(inference.activeOptions?.confidence, false);
    assert.equal(inference.activeOptions?.textContext, true);

    assert.equal(inference.result.rawText?.pages.length, 1);
  });

  it("enqueueAndGetResult must succeed: Filled, single-page image – Base64Input", async () => {
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
    assert.ok(response.inference instanceof ExtractionInference);
    const inference: ExtractionInference = response.inference;
    assert.equal(inference.file?.name, "receipt.jpg");
    assert.equal(inference.model?.id, modelId);

    assert.ok(inference.result);
    assert.equal(inference.result.rawText, undefined);

    const supplierField = inference.result.fields.get("supplier_name") as SimpleField;
    assert.ok(supplierField instanceof SimpleField);
    assert.equal(supplierField.value, "Clachan");

    checkEmptyActiveOptions(inference);
  });

  it("enqueue must raise 422: Invalid model ID", async () => {
    const source = new PathInput({ inputPath: emptyPdfPath });
    const badParams = { modelId: "00000000-0000-0000-0000-000000000000" };

    try {
      await client.enqueue(Extraction, source, badParams);
      assert.fail("Expected the call to throw, but it succeeded.");
    } catch (err) {
      check422(err);
    }
  });

  it("getResult must raise 422: Invalid job ID", async () => {
    try {
      await client.getResult(
        Extraction,
        "00000000-0000-0000-0000-000000000000"
      );
      assert.fail("Expected the call to throw, but it succeeded.");
    } catch (err) {
      check422(err);
    }
  });

  it("enqueue, getJob, and getResult must succeed", async () => {
    const source = new PathInput({ inputPath: emptyPdfPath });
    const params = {
      modelId,
      rag: false,
      rawText: false,
      polygon: false,
      confidence: false,
      alias: "ts_integration_all_together"
    };

    const enqueueResponse = await client.enqueue(
      Extraction, source, params
    );
    assert.ok(enqueueResponse.job.id);
    const resultUrl = await waitForResultUrl(client, enqueueResponse.job.id);

    const resultId = resultUrl.split("/").pop() || "";
    const resultResponse = await client.getResult(
      Extraction, resultId
    );
    assert.strictEqual(resultId, resultResponse.inference.id);
  });

  it("enqueueAndGetResult must succeed: HTTPS URL", async () => {
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
    assert.ok(response);
    assert.ok(response.inference instanceof ExtractionInference);
  });

  it("should override the data schema successfully", async () => {
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
    assert.ok(response);
    assert.ok(response.inference instanceof ExtractionInference);
    assert.ok(response.inference.result.fields.get("test_replace"));
    assert.equal((response.inference.result.fields.get("test_replace") as SimpleField).value, "a test value");

  });

});
