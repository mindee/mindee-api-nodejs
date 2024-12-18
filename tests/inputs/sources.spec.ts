import {
  Base64Input,
  PathInput,
  StreamInput,
  BytesInput,
  BufferInput,
  INPUT_TYPE_BYTES,
  INPUT_TYPE_STREAM,
  INPUT_TYPE_PATH,
  INPUT_TYPE_BASE64,
  INPUT_TYPE_BUFFER,
} from "../../src/input";
import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";
import { Buffer } from "node:buffer";

describe("Test different types of input", () => {
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
});
