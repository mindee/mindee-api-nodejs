import { Readable } from "stream";
import {
  Base64Input,
  BufferInput,
  BytesInput,
  PathInput,
  StreamInput,
  INPUT_TYPE_BASE64,
  INPUT_TYPE_BUFFER,
  INPUT_TYPE_BYTES,
  INPUT_TYPE_PATH,
  INPUT_TYPE_STREAM,
} from "@/input/index.js";
import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";
import sharp from "sharp";
import { Buffer } from "node:buffer";
import { compressImage } from "@/imageOperations/index.js";
import { compressPdf } from "@/pdf/index.js";
import { extractTextFromPdf } from "@/pdf/pdfUtils.js";
import { logger } from "@/logger.js";
import { RESOURCE_PATH, V1_PRODUCT_PATH } from "../index.js";

describe("Test different types of input", () => {
  const outputPath = path.join(RESOURCE_PATH, "output");

  before(async () => {
    await fs.promises.mkdir(outputPath, { recursive: true });
  });
  it("should accept base64 inputs", async () => {
    const b64Input = await fs.promises.readFile(
      path.join(RESOURCE_PATH, "file_types/receipt.txt")
    );
    const b64String = b64Input.toString();
    // don't provide an extension to see if we can detect MIME
    // type based on contents
    const filename = "receipt";
    const inputSource = new Base64Input({
      inputString: b64String,
      filename: filename,
    });
    await inputSource.init();
    expect(inputSource.inputType).to.equals(INPUT_TYPE_BASE64);
    expect(inputSource.filename).to.equals(filename);
    expect(inputSource.mimeType).to.equals("image/jpeg");
    expect(inputSource.isPdf()).to.false;
    expect(await inputSource.getPageCount()).to.equals(1);
    // we need to insert a newline very 76 chars to match the format
    // of the input file.
    const expectedString = inputSource.fileObject
      .toString("base64")
      .replace(/(.{76})/gm, "$1\n");
    expect(expectedString).to.eqls(b64String);
  });

  it("should accept JPEG files from a path", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "expense_receipts/default_sample.jpg"),
    });
    await inputSource.init();

    const expectedResult = await fs.promises.readFile(
      path.join(V1_PRODUCT_PATH, "expense_receipts/default_sample.jpg")
    );
    expect(inputSource.inputType).to.equals(INPUT_TYPE_PATH);
    expect(inputSource.filename).to.equals("default_sample.jpg");
    expect(inputSource.mimeType).to.equals("image/jpeg");
    expect(inputSource.isPdf()).to.false;
    expect(await inputSource.getPageCount()).to.equals(1);
    expect(inputSource.fileObject).to.eqls(expectedResult);
  });

  it("should accept TIFF from a path", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/receipt.tif"),
    });
    await inputSource.init();
    const expectedResult = await fs.promises.readFile(
      path.join(RESOURCE_PATH, "file_types/receipt.tif")
    );
    expect(inputSource.inputType).to.equals(INPUT_TYPE_PATH);
    expect(inputSource.filename).to.equals("receipt.tif");
    expect(inputSource.mimeType).to.equals("image/tiff");
    expect(inputSource.isPdf()).to.false;
    expect(await inputSource.getPageCount()).to.equals(1);
    expect(inputSource.fileObject).to.eqls(expectedResult);
  });

  it("should accept HEIC from a path", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/receipt.heic"),
    });
    await inputSource.init();
    const expectedResult = await fs.promises.readFile(
      path.join(RESOURCE_PATH, "file_types/receipt.heic")
    );
    expect(inputSource.inputType).to.equals(INPUT_TYPE_PATH);
    expect(inputSource.filename).to.equals("receipt.heic");
    expect(inputSource.mimeType).to.equals("image/heic");
    expect(inputSource.isPdf()).to.false;
    expect(await inputSource.getPageCount()).to.equals(1);
    expect(inputSource.fileObject).to.eqls(expectedResult);
  });

  it("should accept WEBP from a path", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/receipt.webp"),
    });
    await inputSource.init();
    const expectedResult = await fs.promises.readFile(
      path.join(RESOURCE_PATH, "file_types/receipt.webp")
    );
    expect(inputSource.inputType).to.equals(INPUT_TYPE_PATH);
    expect(inputSource.filename).to.equals("receipt.webp");
    expect(inputSource.mimeType).to.equals("image/webp");
    expect(inputSource.isPdf()).to.false;
    expect(await inputSource.getPageCount()).to.equals(1);
    expect(inputSource.fileObject).to.eqls(expectedResult);
  });

  it("should accept read streams", async () => {
    const filePath = path.join(V1_PRODUCT_PATH, "expense_receipts/default_sample.jpg");
    const stream = fs.createReadStream(filePath);
    const filename = "default_sample.jpg";
    const inputSource = new StreamInput({
      inputStream: stream,
      filename: filename,
    });
    await inputSource.init();
    expect(inputSource.inputType).to.equals(INPUT_TYPE_STREAM);
    expect(inputSource.filename).to.equals(filename);
    expect(inputSource.mimeType).to.equals("image/jpeg");
    expect(inputSource.isPdf()).to.false;
    expect(await inputSource.getPageCount()).to.equals(1);
    const expectedResult = await fs.promises.readFile(filePath);
    expect(inputSource.fileObject.toString()).to.eqls(expectedResult.toString());
  });

  it("should handle aborted streams", async () => {
    const brokenStream = new Readable({
      read() {
        process.nextTick(() => {
          this.destroy(new Error("aborted"));
        });
      }
    });

    const streamInput = new StreamInput({
      inputStream: brokenStream,
      filename: "broken.jpg"
    });

    try {
      await streamInput.init();
      expect.fail("Should have thrown an error");
    } catch (e: any) {
      expect(e.toString()).to.eq("Error: Error converting stream - Error: aborted");
    }
  });

  it("should handle already-closed streams", async () => {
    const readable = fs.createReadStream(path.join(RESOURCE_PATH, "file_types/receipt.jpg"));

    readable.destroy();
    await new Promise(resolve => readable.on("close", resolve));

    const streamInput = new StreamInput({
      inputStream: readable,
      filename: "closed.jpg"
    });

    try {
      await streamInput.init();
      expect.fail("Should have thrown an error");
    } catch (e: any) {
      expect(e.toString()).to.equal("MindeeError: Stream is already closed");
    }
  });

  it("should handle streams that error during reading", async () => {
    let pushed = false;
    const unstableStream = new Readable({
      read() {
        if (!pushed) {
          this.push("fake data");
          pushed = true;
          process.nextTick(() => {
            this.destroy(new Error("aborted"));
          });
        }
      }
    });

    const streamInput = new StreamInput({
      inputStream: unstableStream,
      filename: "unstable.jpg"
    });

    try {
      await streamInput.init();
    } catch (e: any) {
      expect(e.toString()).to.eq("Error: Error converting stream - Error: aborted");
    }
  });

  it("should accept raw bytes", async () => {
    const filePath = path.join(V1_PRODUCT_PATH, "expense_receipts/default_sample.jpg");
    const inputBytes = await fs.promises.readFile(filePath);
    // don't provide an extension to see if we can detect MIME
    // type based on contents
    const filename = "receipt";
    const inputSource = new BytesInput({
      inputBytes: inputBytes,
      filename: filename,
    });
    await inputSource.init();
    expect(inputSource.inputType).to.equal(INPUT_TYPE_BYTES);
    expect(inputSource.filename).to.equal(filename);
    expect(inputSource.mimeType).to.equal("image/jpeg");
    expect(inputSource.isPdf()).to.false;
    expect(await inputSource.getPageCount()).to.equals(1);
    const expectedResult = await fs.promises.readFile(filePath);
    expect(Buffer.compare(inputSource.fileObject, expectedResult)).to.equal(0);
  });

  it("should accept a Buffer", async () => {
    const filename = "invoice_01.pdf";
    const buffer = Buffer.from(
      await fs.promises.readFile(
        path.join(V1_PRODUCT_PATH, "invoices/invoice_10p.pdf")
      )
    );
    const inputSource = new BufferInput({
      buffer: buffer,
      filename: filename,
    });
    await inputSource.init();
    expect(inputSource.inputType).to.equals(INPUT_TYPE_BUFFER);
    expect(inputSource.filename).to.equals(filename);
    expect(inputSource.isPdf()).to.be.true;
    expect(await inputSource.getPageCount()).to.equals(10);
    expect(inputSource.fileObject).to.be.instanceOf(Buffer);
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
    const metadata = await sharp(imageResizeInput.fileObject).metadata();
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
