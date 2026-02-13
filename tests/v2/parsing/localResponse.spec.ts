import * as fs from "node:fs/promises";
import assert from "node:assert";
import { LocalResponse } from "@/v2/index.js";

import path from "path";
import { V2_PRODUCT_PATH } from "../../index.js";
import { Buffer } from "node:buffer";
import { ExtractionResponse } from "@/v2/product/index.js";

const signature: string = "e51bdf80f1a08ed44ee161100fc30a25cb35b4ede671b0a575dc9064a3f5dbf1";
const dummySecretKey: string = "ogNjY44MhvKPGTtVsI8zG82JqWQa68woYQH";
const filePath: string = path.join(V2_PRODUCT_PATH, "extraction/standard_field_types.json");

async function assertLocalResponse(localResponse: LocalResponse) {
  await localResponse.init();
  assert.notStrictEqual(localResponse.asDict(), null);
  assert.strictEqual(localResponse.isValidHmacSignature(dummySecretKey, "invalid signature"), false);
  assert.strictEqual(localResponse.getHmacSignature(dummySecretKey), signature);
  assert.ok(localResponse.isValidHmacSignature(dummySecretKey, signature));
  const inferenceResponse = await localResponse.deserializeResponse(ExtractionResponse);
  assert.ok(inferenceResponse instanceof ExtractionResponse);
  assert.notStrictEqual(inferenceResponse.inference, null);
}

describe("MindeeV2 - Load Local Response", () => {
  it("should load a string properly.", async () => {
    const fileObj = await fs.readFile(filePath, { encoding: "utf-8" });
    await assertLocalResponse(new LocalResponse(fileObj));
  });

  it("should load a file properly.", async () => {
    await assertLocalResponse(new LocalResponse(filePath));
  });

  it("should load a buffer properly.", async () => {
    const fileStr = (await fs.readFile(filePath, { encoding: "utf-8" })).replace(/\r/g, "").replace(/\n/g, "");
    const fileBuffer = Buffer.from(fileStr, "utf-8");
    await assertLocalResponse(new LocalResponse(fileBuffer));
  });

  it("should deserialize a prediction.", async () => {
    const fileObj = await fs.readFile(filePath, { encoding: "utf-8" });
    const localResponse = new LocalResponse(fileObj);
    const response = await localResponse.deserializeResponse(ExtractionResponse);
    assert.ok(response instanceof ExtractionResponse);

    assert.strictEqual(JSON.stringify(response.getRawHttp()), JSON.stringify(JSON.parse(fileObj)));
  });

  it("loading an inference works on catalog model", async () => {
    const jsonPath = path.join(
      V2_PRODUCT_PATH,
      "extraction",
      "financial_document",
      "complete.json"
    );
    const localResponse = new LocalResponse(jsonPath);
    const response: ExtractionResponse = await localResponse.deserializeResponse(ExtractionResponse);
    assert.strictEqual(response.inference.model.id, "12345678-1234-1234-1234-123456789abc");
  });
});
