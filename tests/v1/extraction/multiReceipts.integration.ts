import assert from "node:assert/strict";
import * as path from "path";
import { Client } from "@/v1/index.js";
import { MultiReceiptsDetectorV1, ReceiptV5 } from "@/v1/product/index.js";
import { extractReceipts } from "@/v1/extraction/index.js";
import { V1_PRODUCT_PATH } from "../../index.js";
import { LocalInputSource, PathInput } from "@/input/index.js";
import { setTimeout } from "node:timers/promises";

const apiKey = process.env.MINDEE_API_KEY;
let client: Client;
let sourceDoc: LocalInputSource;
describe("MindeeV1 - Integration - Multi-Receipt Extraction", () => {
  describe("A Multi-Receipt Image", () => {
    before(async () => {
      sourceDoc = new PathInput({
        inputPath: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/default_sample.jpg"),
      });
      await sourceDoc.init();
      client = new Client({ apiKey });
    });
  });

  describe("A Multi-Receipt PDF", () => {
    before(async () => {
      sourceDoc = new PathInput({
        inputPath: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/multipage_sample.pdf"),
      });
      await sourceDoc.init();
      client = new Client({ apiKey });
    });

    it("should send to the server and cut properly", async () => {
      const multiReceiptResult = await client.parse(MultiReceiptsDetectorV1, sourceDoc);
      assert.strictEqual(multiReceiptResult.document?.inference.prediction.receipts.length, 5);
      const extractedReceipts = await extractReceipts(sourceDoc, multiReceiptResult.document!.inference);
      assert.strictEqual(extractedReceipts.length, 5);
      assert.strictEqual(multiReceiptResult.document?.inference.pages[0].orientation?.value, 0);
      assert.strictEqual(multiReceiptResult.document?.inference.pages[1].orientation?.value, 0);
      const receiptsResults = [];
      for (const extractedReceipt of extractedReceipts) {
        const localInput = extractedReceipt.asSource();
        receiptsResults.push(await client.parse(ReceiptV5, localInput));
        await setTimeout(1000);
      }
      const firstPrediction = receiptsResults[0].document.inference.prediction;
      assert.strictEqual(firstPrediction.lineItems.length, 5);
      assert.strictEqual(firstPrediction.lineItems[0].totalAmount, 70);
      assert.strictEqual(firstPrediction.lineItems[1].totalAmount, 12);
      assert.strictEqual(firstPrediction.lineItems[2].totalAmount, 14);
      assert.strictEqual(firstPrediction.lineItems[3].totalAmount, 11);
      assert.strictEqual(firstPrediction.lineItems[4].totalAmount, 5.6);

      const secondPrediction = receiptsResults[1].document.inference.prediction;
      assert.strictEqual(secondPrediction.lineItems.length, 7);
      assert.strictEqual(secondPrediction.lineItems[0].totalAmount, 6);
      assert.strictEqual(secondPrediction.lineItems[1].totalAmount, 11);
      assert.strictEqual(secondPrediction.lineItems[2].totalAmount, 67.2);
      assert.strictEqual(secondPrediction.lineItems[3].totalAmount, 19.2);
      assert.strictEqual(secondPrediction.lineItems[4].totalAmount, 7);
      assert.strictEqual(secondPrediction.lineItems[5].totalAmount, 5.5);
      assert.strictEqual(secondPrediction.lineItems[6].totalAmount, 36);

      const thirdPrediction = receiptsResults[2].document.inference.prediction;
      assert.strictEqual(thirdPrediction.lineItems.length, 1);
      assert.strictEqual(thirdPrediction.lineItems[0].totalAmount, 275);

      const fourthPrediction = receiptsResults[3].document.inference.prediction;
      assert.strictEqual(fourthPrediction.lineItems.length, 2);
      assert.strictEqual(fourthPrediction.lineItems[0].totalAmount, 11.5);
      assert.strictEqual(fourthPrediction.lineItems[1].totalAmount, 2);

      const fifthPrediction = receiptsResults[4].document.inference.prediction;
      assert.strictEqual(fifthPrediction.lineItems.length, 1);
      assert.strictEqual(fifthPrediction.lineItems[0].totalAmount, 16.5);

    }).timeout(60000);
  });


  describe("A Single-Receipt Image", () => {
    before(async () => {
      sourceDoc = new PathInput({
        inputPath: path.join(V1_PRODUCT_PATH, "expense_receipts/default_sample.jpg"),
      });
      await sourceDoc.init();
      client = new Client({ apiKey });
    });

    it("should send to the server and cut properly", async () => {
      const multiReceiptResult = await client.parse(MultiReceiptsDetectorV1, sourceDoc);
      assert.strictEqual(multiReceiptResult.document?.inference.prediction.receipts.length, 1);
      const receipts = await extractReceipts(sourceDoc, multiReceiptResult.document!.inference);
      assert.strictEqual(receipts.length, 1);
      const receiptResult = await client.parse(ReceiptV5, receipts[0].asSource());
      assert.strictEqual(receiptResult.document.inference.prediction.lineItems.length, 1);
      assert.strictEqual(receiptResult.document.inference.prediction.lineItems[0].totalAmount, 10.2);
      assert.strictEqual(receiptResult.document.inference.prediction.taxes.length, 1);
      assert.strictEqual(receiptResult.document.inference.prediction.taxes[0].value, 1.7);
    }).timeout(60000);
  });
});
