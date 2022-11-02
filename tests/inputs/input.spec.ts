import {
  Base64Input,
  PathInput,
  StreamInput,
  BytesInput,
  UrlInput,
  PageOptionsOperation,
  INPUT_TYPE_URL,
  INPUT_TYPE_BYTES,
  INPUT_TYPE_STREAM,
  INPUT_TYPE_PATH,
  INPUT_TYPE_BASE64,
} from "../../src/inputs";
import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";

describe("Test different types of input", () => {
  it("should accept base64 inputs", async () => {
    const b64Input = await fs.promises.readFile(
      path.join(__dirname, "../data/receipt/receipt.txt")
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
      inputPath: path.join(__dirname, "../data/receipt/receipt.jpg"),
    });
    await input.init();

    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "../data/receipt/receipt.jpg")
    );
    expect(input.inputType).to.equals(INPUT_TYPE_PATH);
    expect(input.filename).to.equals("receipt.jpg");
    expect(input.mimeType).to.equals("image/jpeg");
    expect(input.fileObject).to.eqls(expectedResult);
  });

  it("should accept TIFF from a path", async () => {
    const input = new PathInput({
      inputPath: path.join(__dirname, "../data/receipt/receipt.tif"),
    });
    await input.init();
    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "../data/receipt/receipt.tif")
    );
    expect(input.inputType).to.equals(INPUT_TYPE_PATH);
    expect(input.filename).to.equals("receipt.tif");
    expect(input.mimeType).to.equals("image/tiff");
    expect(input.fileObject).to.eqls(expectedResult);
  });

  it("should accept HEIC from a path", async () => {
    const input = new PathInput({
      inputPath: path.join(__dirname, "../data/receipt/receipt.heic"),
    });
    await input.init();
    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "../data/receipt/receipt.heic")
    );
    expect(input.inputType).to.equals(INPUT_TYPE_PATH);
    expect(input.filename).to.equals("receipt.heic");
    expect(input.mimeType).to.equals("image/heic");
    expect(input.fileObject).to.eqls(expectedResult);
  });

  it("should accept read streams", async () => {
    const filePath = path.join(__dirname, "../data/receipt/receipt.jpg");
    const stream = fs.createReadStream(filePath);
    const filename = "receipt.jpg";
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
    const filePath = path.join(__dirname, "../data/receipt/receipt.jpg");
    const inputBytes = await fs.promises.readFile(filePath);
    // don't provide an extension to see if we can detect MIME
    // type based on contents
    const filename = "receipt";
    const input = new BytesInput({
      inputBytes: inputBytes.toString("hex"),
      filename: filename,
    });
    await input.init();
    expect(input.inputType).to.equals(INPUT_TYPE_BYTES);
    expect(input.filename).to.equals(filename);
    expect(input.mimeType).to.equals("image/jpeg");
    const expectedResult = await fs.promises.readFile(filePath);
    expect(input.fileObject.toString()).to.eqls(expectedResult.toString());
  });

  it("should accept a URL", async () => {
    const input = new UrlInput({
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/ReceiptSwiss.jpg/576px-ReceiptSwiss.jpg",
    });
    await input.init();
    expect(input.inputType).to.equals(INPUT_TYPE_URL);
    expect(input.fileObject).to.be.a("string");
  });

  it("should cut a PDF", async () => {
    const input = new PathInput({
      inputPath: path.join(__dirname, "../data/pdf/multipage.pdf"),
    });
    await input.init();
    await input.cutPdf({
      operation: PageOptionsOperation.KeepOnly,
      pageIndexes: [0, -2, -1],
      onMinPages: 5,
    });
    expect(input.inputType).to.equals(INPUT_TYPE_PATH);
    expect(input.filename).to.equals("multipage.pdf");
    expect(input.mimeType).to.equals("application/pdf");

    // This is how the length of the word is set in the
    // raw PDF file.
    const lengthRE = /(?<=\/FlateDecode[\s\S]\/Length )\d{1,3}/gm;

    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "../data/pdf/multipage_cut-3.pdf"),
      "utf-8"
    );

    const expectedLengths = expectedResult.match(lengthRE);
    const inputDocLengths =
      input.fileObject.toString("utf-8").match(lengthRE) || [];
    expect(expectedLengths).to.have.ordered.members(inputDocLengths);
  });

  it("should not cut the PDF", async () => {
    const filePath = path.join(__dirname, "../data/pdf/multipage.pdf");
    const input = new PathInput({
      inputPath: filePath,
    });
    await input.init();
    const expectedResult = await fs.promises.readFile(filePath);
    expect(input.inputType).to.equals(INPUT_TYPE_PATH);
    expect(input.filename).to.equals("multipage.pdf");
    expect(input.mimeType).to.equals("application/pdf");
    expect(input.fileObject).to.eql(expectedResult);
  });
});
