import path from "path";
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { V2_PRODUCT_PATH } from "../../../index.js";
import { Client, PathInput } from "@/index.js";
import { Extraction } from "@/v2/product/index.js";


describe("MindeeV2 - Extraction RagDocuments", { timeout: 180000 }, () => {
  let client: Client;
  let extractionModelId: string;

  beforeEach(() => {
    const apiKey = process.env["MINDEE_V2_API_KEY"] ?? "";
    extractionModelId = process.env["MINDEE_V2_SE_TESTS_FINDOC_MODEL_ID"] ?? "";
    if (!extractionModelId) {
      throw new Error("Missing MINDEE_V2_SE_TESTS_FINDOC_MODEL_ID environment variable.");
    }

    client = new Client({ apiKey: apiKey, debug: true });
  });

  it("should perform the entire lifecycle of a RAG document", async () => {
    const inputSource = new PathInput(
      { inputPath: path.join(V2_PRODUCT_PATH, "extraction/financial_document/default_sample.jpg") }
    );

    const postResponse = await client.uploadAndGetRagDocumentPoll(
      Extraction,
      inputSource,
      { modelId: extractionModelId }
    );
    assert.ok(postResponse);

    const postAnnotation = postResponse.annotation;
    assert.ok(postAnnotation?.fields);

    const documentId = postResponse.id;
    assert.ok(documentId);

    assert.equal(postResponse.status, "Draft");

    postAnnotation.fields.getSimpleField("supplier_name").selected = true;
    postAnnotation.fields.getSimpleField("supplier_name").guidelines = "I am the walrus!";
    postAnnotation.fields.getSimpleField("invoice_number").selected = true;
    postAnnotation.fields.getSimpleField("invoice_number").guidelines = "koo koo katchoo!";

    const patchAnnotationResponse = await client.updateRagAnnotation(
      Extraction,
      { documentId: documentId, annotation: postAnnotation }
    );
    assert.ok(patchAnnotationResponse);
  });
});
