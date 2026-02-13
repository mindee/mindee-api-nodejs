import * as fs from "node:fs/promises";
import assert from "node:assert";
import path from "path";
import { AsyncPredictResponse, LocalResponse, PredictResponse } from "@/v1/index.js";
import { InternationalIdV2, InvoiceV4, MultiReceiptsDetectorV1 } from "@/v1/product/index.js";
import { V1_RESOURCE_PATH, V1_PRODUCT_PATH } from "../../index.js";

const signature: string = "5ed1673e34421217a5dbfcad905ee62261a3dd66c442f3edd19302072bbf70d0";
const dummySecretKey: string = "ogNjY44MhvKPGTtVsI8zG82JqWQa68woYQH";
const filePath: string = path.join(V1_RESOURCE_PATH, "async/get_completed_empty.json");
const multiReceiptsDetectorPath: string = path.join(
  V1_PRODUCT_PATH, "multi_receipts_detector/response_v1/complete.json"
);
const failedPath: string = path.join(V1_RESOURCE_PATH, "async/get_failed_job_error.json");
const internationalIdPath: string = path.join(
  V1_PRODUCT_PATH, "international_id/response_v2/complete.json"
);

describe("MindeeV1 - Load Local Response", () => {
  it("should load a string properly.", async () => {
    const fileObj = await fs.readFile(filePath, { encoding: "utf-8" });
    const localResponse = new LocalResponse(fileObj);
    await localResponse.init();
    assert.ok(localResponse.asDict());
    assert.strictEqual(
      localResponse.isValidHmacSignature(dummySecretKey, "invalid signature"), false
    );
    assert.strictEqual(localResponse.getHmacSignature(dummySecretKey), signature);
    assert.ok(localResponse.isValidHmacSignature(dummySecretKey, signature));
  });

  it("should load a file properly.", async () => {
    const localResponse = new LocalResponse(filePath);
    await localResponse.init();
    assert.ok(localResponse.asDict());
    assert.strictEqual(
      localResponse.isValidHmacSignature(dummySecretKey, "invalid signature"), false
    );
    assert.strictEqual(localResponse.getHmacSignature(dummySecretKey), signature);
    assert.ok(localResponse.isValidHmacSignature(dummySecretKey, signature));
  });

  it("should load a buffer properly.", async () => {
    const fileStr = (await fs.readFile(filePath, { encoding: "utf-8" }))
      .replace(/\r/g, "")
      .replace(/\n/g, "");
    const fileBuffer = Buffer.from(fileStr, "utf-8");
    const localResponse = new LocalResponse(fileBuffer);
    await localResponse.init();
    assert.ok(localResponse.asDict());
    assert.strictEqual(
      localResponse.isValidHmacSignature(dummySecretKey, "invalid signature"), false
    );
    assert.strictEqual(localResponse.getHmacSignature(dummySecretKey), signature);
    assert.ok(localResponse.isValidHmacSignature(dummySecretKey, signature));
  });

  it("should load into a sync prediction.", async () => {
    const fileObj = await fs.readFile(multiReceiptsDetectorPath, { encoding: "utf-8" });
    const localResponse = new LocalResponse(fileObj);
    const prediction = await localResponse.loadPrediction(MultiReceiptsDetectorV1);
    assert.ok(prediction instanceof PredictResponse);
    assert.strictEqual(
      JSON.stringify(prediction.getRawHttp()), JSON.stringify(JSON.parse(fileObj))
    );
  });

  it("should load a failed prediction.", async () => {
    const fileObj = await fs.readFile(failedPath, { encoding: "utf-8" });
    const localResponse = new LocalResponse(fileObj);
    const prediction = await localResponse.loadPrediction(InvoiceV4);
    assert.ok(prediction instanceof AsyncPredictResponse);
    assert.strictEqual((prediction as AsyncPredictResponse<InvoiceV4>).job.status, "failed");
  });

  it("should load into an async prediction.", async () => {
    const fileObj = await fs.readFile(internationalIdPath, { encoding: "utf-8" });
    const localResponse = new LocalResponse(fileObj);
    const prediction = await localResponse.loadPrediction(InternationalIdV2);
    assert.ok(prediction instanceof AsyncPredictResponse);
    assert.strictEqual(
      JSON.stringify(prediction.getRawHttp()), JSON.stringify(JSON.parse(fileObj))
    );
  });
});
