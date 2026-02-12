import {
  PathInput,
} from "@/input/index.js";
import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";
import { compressImage } from "@/image/index.js";
import { compressPdf } from "@/pdf/index.js";
import { extractTextFromPdf } from "@/pdf/pdfUtils.js";
import { logger } from "@/logger.js";
import { RESOURCE_PATH, V1_PRODUCT_PATH } from "../index.js";

describe("Input Sources - compression and resize #extraDeps", () => {
  const outputPath = path.join(RESOURCE_PATH, "output");

  before(async () => {
    await fs.promises.mkdir(outputPath, { recursive: true });
  });

  it("Image Quality Compress From Input Source", async () => {
    const receiptInput = new PathInput({ inputPath: path.join(RESOURCE_PATH, "file_types/receipt.jpg") });
    await receiptInput.compress(40);
    await fs.promises.writeFile(path.join(outputPath, "compress_indirect.jpg"), receiptInput.fileObject);

    const initialFileStats = await fs.promises.stat(path.join(RESOURCE_PATH, "file_types/receipt.jpg"));
    const renderedFileStats = await fs.promises.stat(path.join(outputPath, "compress_indirect.jpg"));
    expect(renderedFileStats.size).to.be.lessThan(initialFileStats.size);
  });

  it("Image Quality Compresses From Compressor", async () => {
    const receiptInput = new PathInput({ inputPath: path.join(RESOURCE_PATH, "file_types/receipt.jpg") });
    await receiptInput.init();
    const compresses = [
      await compressImage(receiptInput.fileObject, 100),
      await compressImage(receiptInput.fileObject),
      await compressImage(receiptInput.fileObject, 50),
      await compressImage(receiptInput.fileObject, 10),
      await compressImage(receiptInput.fileObject, 1)
    ];

    const fileNames = ["compress100.jpg", "compress75.jpg", "compress50.jpg", "compress10.jpg", "compress1.jpg"];
    for (let i = 0; i < compresses.length; i++) {
      await fs.promises.writeFile(path.join(outputPath, fileNames[i]), compresses[i]);
    }

    const initialFileStats = await fs.promises.stat(path.join(RESOURCE_PATH, "file_types/receipt.jpg"));
    const renderedFileStats = await Promise.all(
      fileNames.map(fileName => fs.promises.stat(path.join(outputPath, fileName)))
    );

    expect(initialFileStats.size).to.be.lessThan(renderedFileStats[0].size);
    expect(initialFileStats.size).to.be.lessThan(renderedFileStats[1].size);
    expect(renderedFileStats[1].size).to.be.greaterThan(renderedFileStats[2].size);
    expect(renderedFileStats[2].size).to.be.greaterThan(renderedFileStats[3].size);
    expect(renderedFileStats[3].size).to.be.greaterThan(renderedFileStats[4].size);
  });

  it("Image Resize From InputSource", async () => {
    const imageResizeInput = new PathInput({ inputPath: path.join(RESOURCE_PATH, "file_types/receipt.jpg") });
    await imageResizeInput.init();

    await imageResizeInput.compress(75, 250, 1000);
    await fs.promises.writeFile(path.join(outputPath, "resize_indirect.jpg"), imageResizeInput.fileObject);

    const initialFileStats = await fs.promises.stat(path.join(RESOURCE_PATH, "file_types/receipt.jpg"));
    const renderedFileStats = await fs.promises.stat(path.join(outputPath, "resize_indirect.jpg"));
    expect(renderedFileStats.size).to.be.lessThan(initialFileStats.size);
    const sharp = await import("sharp");
    const metadata = await sharp.default(imageResizeInput.fileObject).metadata();
    expect(metadata.width).to.equal(250);
    expect(metadata.height).to.equal(333);
  });

  it("Image Resize From Compressor", async () => {
    const imageResizeInput = new PathInput({ inputPath: path.join(RESOURCE_PATH, "file_types/receipt.jpg") });
    await imageResizeInput.init();

    const resizes = [
      await compressImage(imageResizeInput.fileObject, 75, 500),
      await compressImage(imageResizeInput.fileObject, 75, 250, 500),
      await compressImage(imageResizeInput.fileObject, 75, 500, 250),
      await compressImage(imageResizeInput.fileObject, 75, null, 250)
    ];

    const fileNames = ["resize500xnull.jpg", "resize250x500.jpg", "resize500x250.jpg", "resizenullx250.jpg"];
    for (let i = 0; i < resizes.length; i++) {
      await fs.promises.writeFile(path.join(outputPath, fileNames[i]), resizes[i]);
    }

    const initialFileStats = await fs.promises.stat(path.join(RESOURCE_PATH, "file_types/receipt.jpg"));
    const renderedFileStats = await Promise.all(
      fileNames.map(fileName => fs.promises.stat(path.join(outputPath, fileName)))
    );

    expect(initialFileStats.size).to.be.greaterThan(renderedFileStats[0].size);
    expect(renderedFileStats[0].size).to.be.greaterThan(renderedFileStats[1].size);
    expect(renderedFileStats[1].size).to.be.greaterThan(renderedFileStats[2].size);
    expect(renderedFileStats[2].size).to.be.equals(renderedFileStats[3].size);
  });


  it("PDF Input Has Text", async () => {
    const hasSourceTextPath = path.join(RESOURCE_PATH, "file_types/pdf/multipage.pdf");
    const hasNoSourceTextPath = path.join(RESOURCE_PATH, "file_types/pdf/blank_1.pdf");
    const hasNoSourceTextSinceItsImagePath = path.join(RESOURCE_PATH, "file_types/receipt.jpg");

    const hasSourceTextInput = new PathInput({ inputPath: hasSourceTextPath });
    const hasNoSourceTextInput = new PathInput({ inputPath: hasNoSourceTextPath });
    const hasNoSourceTextSinceItsImageInput = new PathInput({ inputPath: hasNoSourceTextSinceItsImagePath });

    expect(await hasSourceTextInput.hasSourceText()).to.be.true;
    expect(await hasNoSourceTextInput.hasSourceText()).to.be.false;
    expect(await hasNoSourceTextSinceItsImageInput.hasSourceText()).to.be.false;
  });

  it("PDF Compress From InputSource", async () => {
    const pdfResizeInput = new PathInput(
      { inputPath: path.join(V1_PRODUCT_PATH, "invoice_splitter/default_sample.pdf") }
    );
    await pdfResizeInput.init();

    const compressedPdf = await compressPdf(
      pdfResizeInput.fileObject, 75, true
    );
    await fs.promises.writeFile(path.join(outputPath, "resize_indirect.pdf"), compressedPdf);

    const initialFileStats = await fs.promises.stat(
      path.join(V1_PRODUCT_PATH, "invoice_splitter/default_sample.pdf")
    );
    const renderedFileStats = await fs.promises.stat(
      path.join(outputPath, "resize_indirect.pdf")
    );
    expect(renderedFileStats.size).to.be.lessThan(initialFileStats.size);
  }).timeout(10000);

  it("PDF Compress From Compressor", async () => {
    const pdfResizeInput = new PathInput(
      { inputPath: path.join(V1_PRODUCT_PATH, "invoice_splitter/default_sample.pdf") }
    );
    await pdfResizeInput.init();

    const resizes = [
      await compressPdf(pdfResizeInput.fileObject, 85),
      await compressPdf(pdfResizeInput.fileObject, 75),
      await compressPdf(pdfResizeInput.fileObject, 50),
      await compressPdf(pdfResizeInput.fileObject, 10)
    ];

    const fileNames = ["compress85.pdf", "compress75.pdf", "compress50.pdf", "compress10.pdf"];
    for (let i = 0; i < resizes.length; i++) {
      await fs.promises.writeFile(path.join(outputPath, fileNames[i]), resizes[i]);
    }

    const initialFileStats = await fs.promises.stat(
      path.join(V1_PRODUCT_PATH, "invoice_splitter/default_sample.pdf")
    );
    const renderedFileStats = await Promise.all(
      fileNames.map(fileName => fs.promises.stat(path.join(outputPath, fileName)))
    );

    expect(initialFileStats.size).to.be.greaterThan(renderedFileStats[0].size);
    expect(renderedFileStats[0].size).to.be.greaterThan(renderedFileStats[1].size);
    expect(renderedFileStats[1].size).to.be.greaterThan(renderedFileStats[2].size);
    expect(renderedFileStats[2].size).to.be.greaterThan(renderedFileStats[3].size);
  }).timeout(20000);

  it("PDF Compress With Text Keeps Text", async () => {
    const initialWithText = new PathInput(
      { inputPath: path.join(RESOURCE_PATH, "file_types/pdf/multipage.pdf") }
    );
    await initialWithText.init();

    const compressedWithText = await compressPdf(
      initialWithText.fileObject, 100, true, false
    );
    const originalText = (await extractTextFromPdf(initialWithText.fileObject)).getConcatenatedText();
    const compressedText = (await extractTextFromPdf(compressedWithText)).getConcatenatedText();

    expect(compressedText).to.equal(originalText);
  }).timeout(60000);

  it("PDF Compress With Text Does Not Compress", async () => {
    const initialWithText = new PathInput(
      { inputPath: path.join(RESOURCE_PATH, "file_types/pdf/multipage.pdf") }
    );
    await initialWithText.init();

    const compressedWithText = await compressPdf(initialWithText.fileObject, 50);

    expect(compressedWithText).to.deep.equal(initialWithText.fileObject);
  }).timeout(10000);

  after(async function () {
    const createdFiles: string[] = [
      "compress10.pdf",
      "compress50.pdf",
      "compress75.pdf",
      "compress85.pdf",
      "resize_indirect.pdf",
      "compress1.jpg",
      "compress10.jpg",
      "compress50.jpg",
      "compress75.jpg",
      "compress100.jpg",
      "compress_indirect.jpg",
      "resize250x500.jpg",
      "resize500x250.jpg",
      "resize500xnull.jpg",
      "resize_indirect.jpg",
      "resizenullx250.jpg",
    ];

    for (const filePath of createdFiles) {
      try {
        await fs.promises.unlink(path.join(RESOURCE_PATH, "output", filePath));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          logger.warn(`Could not delete file '${filePath}': ${(error as Error).message}`);
        }
      }
    }
  });
});
