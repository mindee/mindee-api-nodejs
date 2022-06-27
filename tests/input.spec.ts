import {
  Base64Input,
  PathInput,
  StreamInput,
  BytesInput,
} from "../mindee/inputs";
import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";

describe("Test different types of input", () => {
  it("should accept base64 inputs", async () => {
    const b64Input = await fs.promises.readFile(
      path.join(__dirname, "data/receipt/receipt.txt")
    );
    const b64String = b64Input.toString();
    const filename = "receipt.jpg";
    const input = new Base64Input({
      inputString: b64String,
      filename: filename,
    });
    await input.init();
    expect(input.inputType).to.equals("base64");
    expect(input.filename).to.equals(filename);
    // we need to insert a newline very 76 chars to match the format
    // of the input file.
    const expectedString = input.fileObject
      .toString("base64")
      .replace(/(.{76})/gm, "$1\n");
    expect(expectedString).to.eqls(b64String);
  });

  it("should accept JPEG files from a path", async () => {
    const input = new PathInput({
      inputPath: path.join(__dirname, "data/receipt/receipt.jpg"),
    });
    await input.init();

    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "data/receipt/receipt.jpg")
    );
    expect(input.inputType).to.equals("path");
    expect(input.filename).to.equals("receipt.jpg");
    expect(input.mimeType).to.equals("image/jpeg");
    expect(input.fileObject).to.eqls(expectedResult);
  });

  it("should accept TIFF from a path", async () => {
    const input = new PathInput({
      inputPath: path.join(__dirname, "data/receipt/receipt.tif"),
    });
    await input.init();
    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "data/receipt/receipt.tif")
    );
    expect(input.inputType).to.equals("path");
    expect(input.filename).to.equals("receipt.tif");
    expect(input.mimeType).to.equals("image/tiff");
    expect(input.fileObject).to.eqls(expectedResult);
  });

  it("should accept HEIC from a path", async () => {
    const input = new PathInput({
      inputPath: path.join(__dirname, "data/receipt/receipt.heic"),
    });
    await input.init();
    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "data/receipt/receipt.heic")
    );
    expect(input.inputType).to.equals("path");
    expect(input.filename).to.equals("receipt.heic");
    expect(input.mimeType).to.equals("image/heic");
    expect(input.fileObject).to.eqls(expectedResult);
  });

  it("should accept read streams", async () => {
    const filePath = path.join(__dirname, "data/receipt/receipt.jpg");
    const stream = fs.createReadStream(filePath);
    const filename = "receipt.jpg";
    const input = new StreamInput({
      inputStream: stream,
      filename: filename,
    });
    await input.init();
    expect(input.inputType).to.equals("stream");
    expect(input.filename).to.equals(filename);
    expect(input.mimeType).to.equals("image/jpeg");
    const expectedResult = await fs.promises.readFile(filePath);
    expect(input.fileObject.toString()).to.eqls(expectedResult.toString());
  });

  it("should accept raw bytes", async () => {
    const filePath = path.join(__dirname, "data/receipt/receipt.jpg");
    const inputBytes = await fs.promises.readFile(filePath);

    const filename = "receipt.jpg";
    const input = new BytesInput({
      inputBytes: inputBytes.toString("hex"),
      filename: filename,
    });
    await input.init();
    expect(input.inputType).to.equals("bytes");
    expect(input.filename).to.equals(filename);
    expect(input.mimeType).to.equals("image/jpeg");
    const expectedResult = await fs.promises.readFile(filePath);
    expect(input.fileObject.toString()).to.eqls(expectedResult.toString());
  });

  it("should cut a PDF", async () => {
    const inputDoc = new PathInput({
      inputPath: path.join(__dirname, "data/pdf/multipage.pdf"),
    });
    await inputDoc.init();
    await inputDoc.cutPdf();
    expect(inputDoc.inputType).to.equals("path");
    expect(inputDoc.filename).to.equals("multipage.pdf");
    expect(inputDoc.mimeType).to.equals("application/pdf");
    expect(await inputDoc.countPages()).to.equals(3);

    // This is how the length of the word is set in the
    // raw PDF file.
    const lengthRE = /(?<=\/FlateDecode[\s\S]\/Length )\d{1,3}/gm;

    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "data/pdf/multipage_cut-3.pdf"),
      "utf-8"
    );

    const expectedLengths = expectedResult.match(lengthRE);
    const inputDocLengths =
      inputDoc.fileObject.toString("utf-8").match(lengthRE) || [];
    expect(expectedLengths).to.have.ordered.members(inputDocLengths);
  });

  it("should not cut the PDF", async () => {
    const filePath = path.join(__dirname, "data/pdf/multipage.pdf");
    const inputDoc = new PathInput({
      inputPath: filePath,
    });
    await inputDoc.init();
    const expectedResult = await fs.promises.readFile(filePath);
    expect(inputDoc.inputType).to.equals("path");
    expect(inputDoc.filename).to.equals("multipage.pdf");
    expect(inputDoc.mimeType).to.equals("application/pdf");
    expect(await inputDoc.countPages()).to.equals(12);
    expect(inputDoc.fileObject).to.eql(expectedResult);
  });
});
