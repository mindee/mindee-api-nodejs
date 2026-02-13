import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import path from "path";
import * as fs from "node:fs/promises";
import { MultiReceiptsDetectorV1 } from "@/v1/product/index.js";
import { extractReceipts } from "@/v1/extraction/index.js";
import { PathInput } from "@/index.js";
import { Document } from "@/v1/index.js";
import { RESOURCE_PATH, V1_PRODUCT_PATH } from "../../index.js";

const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/response_v1/complete.json"),
  fileSample: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/default_sample.jpg"),
  completeMultiPage: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/response_v1/multipage_sample.json"),
  multiPageSample: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/multipage_sample.pdf"),
};
describe("MindeeV1 - Multi-Receipt Extraction #OptionalDepsRequired", () => {

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

  const rotations = [
    { angle: 0, suffix: "" },
    { angle: 90, suffix: "_90" },
    { angle: 180, suffix: "_180" },
    { angle: 270, suffix: "_270" }
  ];

  rotations.forEach(({ angle, suffix }) => {
    describe(`${angle}° rotation`, () => {
      let extractedReceipts: any[];
      let sourceDoc: PathInput;

      before(async () => {
        const jsonFileName = `complete${suffix}.json`;
        const imageFileName = `default_sample${suffix}.jpg`;

        const jsonData = await fs.readFile(
          path.join(V1_PRODUCT_PATH, `multi_receipts_detector/response_v1/${jsonFileName}`)
        );

        sourceDoc = new PathInput({
          inputPath: path.join(V1_PRODUCT_PATH, `multi_receipts_detector/${imageFileName}`),
        });
        await sourceDoc.init();

        const response = JSON.parse(jsonData.toString());
        const doc = new Document(MultiReceiptsDetectorV1, response.document);
        extractedReceipts = await extractReceipts(sourceDoc, doc.inference);
      });

      it("should be split into the proper receipts", async () => {
        assert.strictEqual(extractedReceipts.length, 6);
        let i = 0;
        for (const extractedReceipt of extractedReceipts) {
          assert.strictEqual(extractedReceipt.pageId, 0);
          assert.strictEqual(extractedReceipt.receiptId, i);
          assert.ok(Buffer.byteLength(extractedReceipt.asSource().fileObject) < 10485760);
          assert.ok(Buffer.byteLength(extractedReceipt.asSource().fileObject) > 100000);
          i++;
        }
      });

      it("should be saved locally", async () => {
        let i = 0;
        for (const extractedReceipt of extractedReceipts) {
          const outputPrefix = `extracted_receipt_${angle}deg_${i}`;
          extractedReceipt.saveToFile(path.join(RESOURCE_PATH, `output/${outputPrefix}.pdf`));
          await extractedReceipt.saveToFileAsync(path.join(RESOURCE_PATH, `output/${outputPrefix}.png`));
          await extractedReceipt.saveToFileAsync(path.join(RESOURCE_PATH, `output/${outputPrefix}.jpg`));

          const pdfStat = await fs.stat(path.join(RESOURCE_PATH, `output/${outputPrefix}.pdf`));
          // Arbitrary to assert noticeable discrepancies between OSes
          assert.ok(pdfStat.size > 500000);

          const jpgStat = await fs.stat(path.join(RESOURCE_PATH, `output/${outputPrefix}.jpg`));
          assert.ok(jpgStat.size > 40000);

          const pngStat = await fs.stat(path.join(RESOURCE_PATH, `output/${outputPrefix}.png`));
          assert.ok(pngStat.size > 290000);
          i++;
        }
      });

      after(async () => {
        for (let i = 0; i < extractedReceipts.length; i++) {
          const outputPrefix = `extracted_receipt_${angle}deg_${i}`;
          await fs.unlink(path.join(RESOURCE_PATH, `output/${outputPrefix}.pdf`));
          await fs.unlink(path.join(RESOURCE_PATH, `output/${outputPrefix}.jpg`));
          await fs.unlink(path.join(RESOURCE_PATH, `output/${outputPrefix}.png`));
        }
      });
    });
  });
});
