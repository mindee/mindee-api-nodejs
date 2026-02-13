import { expect } from "chai";
import { promises as fs } from "fs";
import * as path from "path";
import { PathInput } from "@/index.js";
import { Document } from "@/v1/index.js";
import { MultiReceiptsDetectorV1 } from "@/v1/product/index.js";
import { extractReceipts } from "@/v1/extraction/index.js";
import { RESOURCE_PATH, V1_PRODUCT_PATH } from "../../index.js";

const rotations = [
  { angle: 0, suffix: "" },
  { angle: 90, suffix: "_90" },
  { angle: 180, suffix: "_180" },
  { angle: 270, suffix: "_270" }
];

rotations.forEach(({ angle, suffix }) => {
  describe(`Multi-Receipt Document - ${angle}° rotation #includeOptionalDeps`, () => {
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
      expect(extractedReceipts.length).to.be.equals(6);
      let i = 0;
      for (const extractedReceipt of extractedReceipts) {
        expect(extractedReceipt.pageId).to.be.equal(0);
        expect(extractedReceipt.receiptId).to.be.equal(i);
        expect(Buffer.byteLength(extractedReceipt.asSource().fileObject)).to.be.lessThan(10485760);
        expect(Buffer.byteLength(extractedReceipt.asSource().fileObject)).to.be.greaterThan(100000);
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
        expect(pdfStat.size).to.be.greaterThan(500000);

        const jpgStat = await fs.stat(path.join(RESOURCE_PATH, `output/${outputPrefix}.jpg`));
        expect(jpgStat.size).to.be.greaterThan(40000);

        const pngStat = await fs.stat(path.join(RESOURCE_PATH, `output/${outputPrefix}.png`));
        expect(pngStat.size).to.be.greaterThan(290000);
        i++;
      }
    }).timeout(20000);

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
