import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as fs from "node:fs/promises";

import { LocalResponse } from "@/v2/index.js";
import { V2_PRODUCT_PATH } from "../../index.js";
import { Buffer } from "node:buffer";
import { ExtractionResponse } from "@/v2/product/index.js";

const signature: string = "e51bdf80f1a08ed44ee161100fc30a25cb35b4ede671b0a575dc9064a3f5dbf1";
const dummySecretKey: string = "ogNjY44MhvKPGTtVsI8zG82JqWQa68woYQH";
const filePath: string = path.join(V2_PRODUCT_PATH, "extraction/standard_field_types.json");

/**
 * Asserts that a local response is valid.
 */
async function assertLocalResponse(localResponse: LocalResponse, fileContent: string) {
  await localResponse.init();
  assert.notStrictEqual(await localResponse.asDict(), null);

  assert.strictEqual(localResponse.getHmacSignature(dummySecretKey), signature);

  assert.strictEqual(localResponse.isValidHmacSignature(dummySecretKey, "invalid signature"), false);
  assert.strictEqual(localResponse.isValidHmacSignature(dummySecretKey, null as any), false);
  assert.strictEqual(localResponse.isValidHmacSignature(null as any, signature), false);
  assert.strictEqual(localResponse.isValidHmacSignature(null as any, null as any), false);
  assert.strictEqual(localResponse.isValidHmacSignature(dummySecretKey, ""), false);
  assert.ok(localResponse.isValidHmacSignature(dummySecretKey, signature));
  assert.ok(localResponse.isValidHmacSignature(dummySecretKey, signature.toUpperCase()));

  const response = await localResponse.deserializeResponse(ExtractionResponse);
  assert.ok(response instanceof ExtractionResponse);
  assert.notStrictEqual(response.inference, null);
  assert.strictEqual(response.inference.model.id, "test-model-id");
  assert.strictEqual(
    response.inference.result.fields.getSimpleField("field_simple_string").stringValue,
    "field_simple_string-value"
  );

  assert.strictEqual(
    JSON.stringify(response.getRawHttp()), JSON.stringify(JSON.parse(fileContent))
  );

  assert.strictEqual(
    localResponse.toString(),
    fileContent.replace(/[\r\n]/g, "")
  );
}

describe("MindeeV2 - Load Local Response", () => {
  it("should load a response from a JSON string.", async () => {
    const fileContent = await fs.readFile(filePath, { encoding: "utf-8" });
    await assertLocalResponse(new LocalResponse(fileContent), fileContent);
  });

  it("should load a response from a buffer", async () => {
    const fileContent = (await fs.readFile(filePath, { encoding: "utf-8" })).replace(/\r/g, "").replace(/\n/g, "");
    const fileBuffer = Buffer.from(fileContent, "utf-8");
    await assertLocalResponse(new LocalResponse(fileBuffer), fileContent);
  });

  it("should load a response from a JSON file", async () => {
    await assertLocalResponse(new LocalResponse(filePath), await fs.readFile(filePath, { encoding: "utf-8" }));
  });

  it("should raise an exception when given an invalid JSON string", async () => {
    const localResponse = new LocalResponse("{invalid json");
    await assert.rejects(async () => {
      await localResponse.deserializeResponse(ExtractionResponse);
    });
  });

  it("should raise an exception when given an empty value", () => {
    assert.throws(() => new LocalResponse(""));
    assert.throws(() => new LocalResponse(Buffer.alloc(0)));
  });

  it("should raise an exception when given a null value", () => {
    assert.throws(() => new LocalResponse(null as any));
    assert.throws(() => new LocalResponse(undefined as any));
  });
});
