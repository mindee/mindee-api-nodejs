import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { promises as fs } from "fs";
import { V2_PRODUCT_PATH } from "../../../index.js";
import {
  ExtractionRagAnnotationResponse, RagAnnotation
} from "@/v2/product/extraction/ragDocuments/index.js";
import {
  RagDocumentUploadParameters, RagDocumentAnnotationParameters
} from "@/v2/product/extraction/ragDocuments/params/index.js";


describe("MindeeV2 - Extraction RagDocuments", () => {

  /**
   * Init a response from a JSON file.
   */
  async function getResponse(relativePath: string) {
    const fileContents = await fs.readFile(
      path.join(V2_PRODUCT_PATH, relativePath)
    );
    const dict = JSON.parse(fileContents.toString());
    return new ExtractionRagAnnotationResponse(dict);
  }

  it("should init POST parameters", () => {
    const parameters = new RagDocumentUploadParameters({ modelId: "invalid-model-id" });
    const reqParams = parameters.getRequestParameters();

    assert.strictEqual(reqParams["model_id"], "invalid-model-id");
  });

  it("should init PATCH parameters", () => {
    const annotation = new RagAnnotation({});
    const parameters = new RagDocumentAnnotationParameters({
      documentId: "invalid-document-id",
      status: "Active",
      annotation: annotation
    });
    const reqParams = parameters.getRequestParameters();

    assert.strictEqual(parameters.documentId, "invalid-document-id");
    assert.strictEqual(reqParams["status"], "Active");
    assert.strictEqual(reqParams["annotation"], JSON.stringify(annotation));
  });

  it("should load a POST response from a JSON string", async () => {
    const response = await getResponse("extraction/rag_documents/post_response.json");

    assert.ok(response);
    assert.strictEqual(response.id, "cc831599-c545-48b7-aa27-6d7ccd5b8d32");
    assert.strictEqual(response.status, "Processing");
    assert.strictEqual(response.annotation, null);
  });

  it("should load a GET response from a JSON string", async () => {
    const response = await getResponse("extraction/rag_documents/get_response_draft.json");

    assert.ok(response);
    assert.strictEqual(response.id, "cc831599-c545-48b7-aa27-6d7ccd5b8d32");
    assert.strictEqual(response.status, "Draft");
    assert.ok(response.annotation);

    const fields = response.annotation.fields;
    assert.ok(fields);

    // null simple field
    const tipField = fields.getSimpleField("tip");
    assert.ok(tipField);
    assert.strictEqual(tipField.selected, false);
    assert.strictEqual(tipField.guidelines, null);
    assert.strictEqual(tipField.value, null);

    // filled simple field
    const dateField = fields.getSimpleField("date");
    assert.ok(dateField);
    assert.strictEqual(dateField.selected, false);
    assert.strictEqual(dateField.guidelines, null);
    assert.strictEqual(dateField.value, "2019-11-02");

    // filled object field
    const localeField = fields.getObjectField("locale");
    assert.ok(localeField);
    assert.strictEqual(localeField.selected, false);
    assert.strictEqual(localeField.guidelines, null);
    assert.ok(localeField.fields);
    assert.strictEqual(localeField.fields.size, 3);
    assert.strictEqual(localeField.getSimpleField("country").value, "US");
    assert.strictEqual(localeField.getSimpleField("currency").value, "USD");
    assert.strictEqual(localeField.getSimpleField("language").value, null);

    // list of simple fields
    const referenceNumbersField = fields.getListField("reference_numbers");
    assert.ok(referenceNumbersField);
    assert.strictEqual(referenceNumbersField.selected, false);
    assert.strictEqual(referenceNumbersField.guidelines, null);
    assert.ok(referenceNumbersField.simpleItems);
    assert.strictEqual(referenceNumbersField.simpleItems.length, 1);
    assert.strictEqual(referenceNumbersField.simpleItems[0].value, "2412/2019");

    // list of object fields
    const lineItemsField = fields.getListField("line_items");
    assert.ok(lineItemsField);
    assert.strictEqual(lineItemsField.selected, false);
    assert.strictEqual(lineItemsField.guidelines, null);
    assert.ok(lineItemsField.objectItems);
    assert.strictEqual(lineItemsField.objectItems.length, 3);

    const lineItem0 = lineItemsField.objectItems[0];
    assert.ok(lineItem0.fields);
    assert.strictEqual(lineItem0.fields.size, 8);
    assert.strictEqual(lineItem0.getSimpleField("description").value, "Front and rear brake cables");
    assert.strictEqual(lineItem0.getSimpleField("quantity").value, 1);
    assert.strictEqual(lineItem0.getSimpleField("unit_price").value, 100);
    assert.strictEqual(lineItem0.getSimpleField("total_price").value, 100);
    assert.strictEqual(lineItem0.getSimpleField("tax_rate").value, null);
    assert.strictEqual(lineItem0.getSimpleField("tax_amount").value, null);
    assert.strictEqual(lineItem0.getSimpleField("product_code").value, null);
    assert.strictEqual(lineItem0.getSimpleField("unit_measure").value, null);

    const lineItem1 = lineItemsField.objectItems[1];
    assert.ok(lineItem1.fields);
    assert.strictEqual(lineItem1.fields.size, 8);
    assert.strictEqual(lineItem1.getSimpleField("description").value, "New set of pedal arms");
    assert.strictEqual(lineItem1.getSimpleField("quantity").value, 2);
    assert.strictEqual(lineItem1.getSimpleField("unit_price").value, 25);
    assert.strictEqual(lineItem1.getSimpleField("total_price").value, 50);
    assert.strictEqual(lineItem1.getSimpleField("tax_rate").value, null);
    assert.strictEqual(lineItem1.getSimpleField("tax_amount").value, null);
    assert.strictEqual(lineItem1.getSimpleField("product_code").value, null);
    assert.strictEqual(lineItem1.getSimpleField("unit_measure").value, null);

    const lineItem2 = lineItemsField.objectItems[2];
    assert.ok(lineItem2.fields);
    assert.strictEqual(lineItem2.fields.size, 8);
    assert.strictEqual(lineItem2.getSimpleField("description").value, "Labor 3hrs");
    assert.strictEqual(lineItem2.getSimpleField("quantity").value, 3);
    assert.strictEqual(lineItem2.getSimpleField("unit_price").value, 15);
    assert.strictEqual(lineItem2.getSimpleField("total_price").value, 45);
    assert.strictEqual(lineItem2.getSimpleField("tax_rate").value, null);
    assert.strictEqual(lineItem2.getSimpleField("tax_amount").value, null);
    assert.strictEqual(lineItem2.getSimpleField("product_code").value, null);
    assert.strictEqual(lineItem2.getSimpleField("unit_measure").value, null);
  });
});

