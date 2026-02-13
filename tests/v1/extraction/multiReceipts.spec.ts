import assert from "node:assert/strict";
import { describe, it } from "node:test";
import path from "path";
import * as fs from "node:fs/promises";
import { MultiReceiptsDetectorV1 } from "@/v1/product/index.js";
import { extractReceipts } from "@/v1/extraction/index.js";
import { PathInput } from "@/index.js";
import { V1_PRODUCT_PATH } from "../../index.js";

const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/response_v1/complete.json"),
  fileSample: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/default_sample.jpg"),
  completeMultiPage: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/response_v1/multipage_sample.json"),
  multiPageSample: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/multipage_sample.pdf"),
};
describe("MindeeV1 - Multi-Receipt Extraction", () => {
  describe("A single-page multi-receipts document", () => {
    it("should be split properly.", async () => {
      const jsonDataNA = await fs.readFile(path.resolve(dataPath.complete));
      const response = JSON.parse(jsonDataNA.toString());
      const doc = new MultiReceiptsDetectorV1(response.document.inference);
      const inputSample = new PathInput({ inputPath: dataPath.fileSample });
      await inputSample.init();
      const extractedReceipts = await extractReceipts(inputSample, doc);
      assert.strictEqual(extractedReceipts.length, 6);
      for (let i = 0; i < extractedReceipts.length; i++) {
        assert.ok(extractedReceipts[i].buffer);
        assert.strictEqual(extractedReceipts[i].pageId, 0);
        assert.strictEqual(extractedReceipts[i].receiptId, i);
      }
    });
  });
  describe("A multi-page multi-receipts document", () => {
    it("should be split properly.", async () => {
      const jsonDataNA = await fs.readFile(path.resolve(dataPath.completeMultiPage));
      const response = JSON.parse(jsonDataNA.toString());
      const doc = new MultiReceiptsDetectorV1(response.document.inference);
      const inputSample = new PathInput({ inputPath: dataPath.multiPageSample });
      await inputSample.init();
      const extractedReceipts = await extractReceipts(inputSample, doc);
      assert.strictEqual(extractedReceipts.length, 5);

      assert.ok(extractedReceipts[0].buffer);
      assert.strictEqual(extractedReceipts[0].pageId, 0);
      assert.strictEqual(extractedReceipts[0].receiptId, 0);

      assert.ok(extractedReceipts[1].buffer);
      assert.strictEqual(extractedReceipts[1].pageId, 0);
      assert.strictEqual(extractedReceipts[1].receiptId, 1);

      assert.ok(extractedReceipts[2].buffer);
      assert.strictEqual(extractedReceipts[2].pageId, 0);
      assert.strictEqual(extractedReceipts[2].receiptId, 2);

      assert.ok(extractedReceipts[3].buffer);
      assert.strictEqual(extractedReceipts[3].pageId, 1);
      assert.strictEqual(extractedReceipts[3].receiptId, 0);

      assert.ok(extractedReceipts[4].buffer);
      assert.strictEqual(extractedReceipts[4].pageId, 1);
      assert.strictEqual(extractedReceipts[4].receiptId, 1);
    });
  });
});
