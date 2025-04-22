import {
  Base64Input,
  BufferInput,
  BytesInput,
  INPUT_TYPE_BASE64,
  INPUT_TYPE_BUFFER,
  INPUT_TYPE_BYTES,
  INPUT_TYPE_PATH,
  INPUT_TYPE_STREAM,
  PathInput,
  StreamInput,
} from "../../src/input";
import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";
import sharp from "sharp";
import { Buffer } from "node:buffer";
import { compressImage } from "../../src/imageOperations";
import { compressPdf } from "../../src/pdf";
import { extractTextFromPdf } from "../../src/pdf/pdfUtils";
import { logger } from "../../src/logger";

describe("Test different types of input", () => {
  const resourcesPath = path.join(__dirname, "../data");
  const outputPath = path.join(resourcesPath, "output");

  before(async () => {
    await fs.promises.mkdir(outputPath, { recursive: true });
  });
  it("should accept base64 inputs", async () => {
    const b64Input = await fs.promises.readFile(
      path.join(__dirname, "../data/file_types/receipt.txt")
    );
    const b64String = b64Input.toString();
    // don't provide an extension to see if we can detect MIME
    // type based on contents
    const filename = "receipt";
    const input = new Base64Input({
      inputString: b64String,
      filename: filename,
    });
    await input.init();
    expect(input.inputType).to.equals(INPUT_TYPE_BASE64);
    expect(input.filename).to.equals(filename);
    expect(input.mimeType).to.equals("image/jpeg");
    // we need to insert a newline very 76 chars to match the format
    // of the input file.
    const expectedString = input.fileObject
      .toString("base64")
      .replace(/(.{76})/gm, "$1\n");
    expect(expectedString).to.eqls(b64String);
  });

  it("should accept JPEG files from a path", async () => {
    const input = new PathInput({
      inputPath: path.join(__dirname, "../data/products/expense_receipts/default_sample.jpg"),
    });
    await input.init();

    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "../data/products/expense_receipts/default_sample.jpg")
    );
    expect(input.inputType).to.equals(INPUT_TYPE_PATH);
    expect(input.filename).to.equals("default_sample.jpg");
    expect(input.mimeType).to.equals("image/jpeg");
    expect(input.fileObject).to.eqls(expectedResult);
  });

  it("should accept TIFF from a path", async () => {
    const input = new PathInput({
      inputPath: path.join(__dirname, "../data/file_types/receipt.tif"),
    });
    await input.init();
    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "../data/file_types/receipt.tif")
    );
    expect(input.inputType).to.equals(INPUT_TYPE_PATH);
    expect(input.filename).to.equals("receipt.tif");
    expect(input.mimeType).to.equals("image/tiff");
    expect(input.fileObject).to.eqls(expectedResult);
  });

  it("should accept HEIC from a path", async () => {
    const input = new PathInput({
      inputPath: path.join(__dirname, "../data/file_types/receipt.heic"),
    });
    await input.init();
    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "../data/file_types/receipt.heic")
    );
    expect(input.inputType).to.equals(INPUT_TYPE_PATH);
    expect(input.filename).to.equals("receipt.heic");
    expect(input.mimeType).to.equals("image/heic");
    expect(input.fileObject).to.eqls(expectedResult);
  });

  it("should accept read streams", async () => {
    const filePath = path.join(__dirname, "../data/products/expense_receipts/default_sample.jpg");
    const stream = fs.createReadStream(filePath);
    const filename = "default_sample.jpg";
    const input = new StreamInput({
      inputStream: stream,
      filename: filename,
    });
    await input.init();
    expect(input.inputType).to.equals(INPUT_TYPE_STREAM);
    expect(input.filename).to.equals(filename);
    expect(input.mimeType).to.equals("image/jpeg");
    const expectedResult = await fs.promises.readFile(filePath);
    expect(input.fileObject.toString()).to.eqls(expectedResult.toString());
  });

  it("should accept raw bytes", async () => {
    const filePath = path.join(__dirname, "../data/products/expense_receipts/default_sample.jpg");
    const inputBytes = await fs.promises.readFile(filePath);
    // don't provide an extension to see if we can detect MIME
    // type based on contents
    const filename = "receipt";
    const input = new BytesInput({
      inputBytes: inputBytes,
      filename: filename,
    });
    await input.init();
    expect(input.inputType).to.equal(INPUT_TYPE_BYTES);
    expect(input.filename).to.equal(filename);
    expect(input.mimeType).to.equal("image/jpeg");
    const expectedResult = await fs.promises.readFile(filePath);
    expect(Buffer.compare(input.fileObject, expectedResult)).to.equal(0);
  });

  it("should accept a Buffer", async () => {
    const filename = "invoice_01.pdf";
    const buffer = Buffer.from(
      await fs.promises.readFile(
        path.join(__dirname, "../data/products/invoices/invoice_10p.pdf")
      )
    );
    const input = new BufferInput({
      buffer: buffer,
      filename: filename,
    });
    await input.init();
    expect(input.inputType).to.equals(INPUT_TYPE_BUFFER);
    expect(input.filename).to.equals(filename);
    expect(input.isPdf()).to.be.true;
    expect(input.fileObject).to.be.instanceOf(Buffer);
  });


  it("Image Quality Compress From Input Source", async () => {
    const receiptInput = new PathInput({ inputPath: path.join(resourcesPath, "file_types/receipt.jpg") });
    await receiptInput.init();
    await receiptInput.compress(40);
    await fs.promises.writeFile(path.join(outputPath, "compress_indirect.jpg"), receiptInput.fileObject);

    const initialFileStats = await fs.promises.stat(path.join(resourcesPath, "file_types/receipt.jpg"));
    const renderedFileStats = await fs.promises.stat(path.join(outputPath, "compress_indirect.jpg"));
    expect(renderedFileStats.size).to.be.lessThan(initialFileStats.size);
  });

  it("Image Quality Compresses From Compressor", async () => {
    const receiptInput = new PathInput({ inputPath: path.join(resourcesPath, "file_types/receipt.jpg") });
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

    const initialFileStats = await fs.promises.stat(path.join(resourcesPath, "file_types/receipt.jpg"));
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
    const imageResizeInput = new PathInput({ inputPath: path.join(resourcesPath, "file_types/receipt.jpg") });
    await imageResizeInput.init();

    await imageResizeInput.compress(75, 250, 1000);
    await fs.promises.writeFile(path.join(outputPath, "resize_indirect.jpg"), imageResizeInput.fileObject);

    const initialFileStats = await fs.promises.stat(path.join(resourcesPath, "file_types/receipt.jpg"));
    const renderedFileStats = await fs.promises.stat(path.join(outputPath, "resize_indirect.jpg"));
    expect(renderedFileStats.size).to.be.lessThan(initialFileStats.size);
    const metadata = await sharp(imageResizeInput.fileObject).metadata();
    expect(metadata.width).to.equal(250);
    expect(metadata.height).to.equal(333);
  });

  it("Image Resize From Compressor", async () => {
    const imageResizeInput = new PathInput({ inputPath: path.join(resourcesPath, "file_types/receipt.jpg") });
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

    const initialFileStats = await fs.promises.stat(path.join(resourcesPath, "file_types/receipt.jpg"));
    const renderedFileStats = await Promise.all(
      fileNames.map(fileName => fs.promises.stat(path.join(outputPath, fileName)))
    );

    expect(initialFileStats.size).to.be.greaterThan(renderedFileStats[0].size);
    expect(renderedFileStats[0].size).to.be.greaterThan(renderedFileStats[1].size);
    expect(renderedFileStats[1].size).to.be.greaterThan(renderedFileStats[2].size);
    expect(renderedFileStats[2].size).to.be.equals(renderedFileStats[3].size);
  });


  it("PDF Input Has Text", async () => {
    const hasSourceTextPath = path.join(resourcesPath, "file_types/pdf/multipage.pdf");
    const hasNoSourceTextPath = path.join(resourcesPath, "file_types/pdf/blank_1.pdf");
    const hasNoSourceTextSinceItsImagePath = path.join(resourcesPath, "file_types/receipt.jpg");

    const hasSourceTextInput = new PathInput({ inputPath: hasSourceTextPath });
    const hasNoSourceTextInput = new PathInput({ inputPath: hasNoSourceTextPath });
    const hasNoSourceTextSinceItsImageInput = new PathInput({ inputPath: hasNoSourceTextSinceItsImagePath });

    await hasSourceTextInput.init();
    await hasNoSourceTextInput.init();
    await hasNoSourceTextSinceItsImageInput.init();

    expect(await hasSourceTextInput.hasSourceText()).to.be.true;
    expect(await hasNoSourceTextInput.hasSourceText()).to.be.false;
    expect(await hasNoSourceTextSinceItsImageInput.hasSourceText()).to.be.false;
  });

  it("PDF Compress From InputSource", async () => {
    const pdfResizeInput = new PathInput(
      { inputPath: path.join(resourcesPath, "products/invoice_splitter/default_sample.pdf") }
    );
    await pdfResizeInput.init();

    const compressedPdf = await compressPdf(pdfResizeInput.fileObject, 75, true);
    await fs.promises.writeFile(path.join(outputPath, "resize_indirect.pdf"), compressedPdf);

    const initialFileStats = await fs.promises.stat(
      path.join(
        resourcesPath,
        "products/invoice_splitter/default_sample.pdf"
      )
    );
    const renderedFileStats = await fs.promises.stat(path.join(outputPath, "resize_indirect.pdf"));

    expect(renderedFileStats.size).to.be.lessThan(initialFileStats.size);
  }).timeout(10000);

  it("PDF Compress From Compressor", async () => {
    const pdfResizeInput = new PathInput(
      { inputPath: path.join(resourcesPath, "products/invoice_splitter/default_sample.pdf") }
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
      path.join(resourcesPath, "products/invoice_splitter/default_sample.pdf")
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
    const initialWithText = new PathInput({ inputPath: path.join(resourcesPath, "file_types/pdf/multipage.pdf") });
    await initialWithText.init();

    const compressedWithText = await compressPdf(initialWithText.fileObject, 100, true, false);

    const originalText = (await extractTextFromPdf(initialWithText.fileObject)).getConcatenatedText();
    const compressedText = (await extractTextFromPdf(compressedWithText)).getConcatenatedText();

    expect(compressedText).to.equal(originalText);
  }).timeout(60000);

  it("PDF Compress With Text Does Not Compress", async () => {
    const initialWithText = new PathInput({ inputPath: path.join(resourcesPath, "file_types/pdf/multipage.pdf") });
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
        await fs.promises.unlink(path.join(resourcesPath, "output", filePath));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          logger.warn(`Could not delete file '${filePath}': ${(error as Error).message}`);
        }
      }
    }
  });
});
