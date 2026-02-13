import { Readable } from "stream";
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
} from "@/input/index.js";
import * as fs from "fs";
import * as path from "path";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { MindeeInputSourceError } from "@/errors/index.js";
import { RESOURCE_PATH, V1_PRODUCT_PATH } from "../index.js";

describe("Input Sources: - load different types of input", () => {

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
    assert.strictEqual(inputSource.inputType, INPUT_TYPE_BASE64);
    assert.strictEqual(inputSource.filename, filename);
    assert.strictEqual(inputSource.mimeType, "image/jpeg");
    assert.ok(!inputSource.isPdf());
    assert.strictEqual(await inputSource.getPageCount(), 1);
    // we need to insert a newline very 76 chars to match the format
    // of the input file.
    const expectedString = inputSource.fileObject
      .toString("base64")
      .replace(/(.{76})/gm, "$1\n");
    assert.deepStrictEqual(expectedString, b64String);
  });

  it("should accept JPEG files from a path", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "expense_receipts/default_sample.jpg"),
    });
    await inputSource.init();

    const expectedResult = await fs.promises.readFile(
      path.join(V1_PRODUCT_PATH, "expense_receipts/default_sample.jpg")
    );
    assert.strictEqual(inputSource.inputType, INPUT_TYPE_PATH);
    assert.strictEqual(inputSource.filename, "default_sample.jpg");
    assert.strictEqual(inputSource.mimeType, "image/jpeg");
    assert.ok(!inputSource.isPdf());
    assert.strictEqual(await inputSource.getPageCount(), 1);
    assert.deepStrictEqual(inputSource.fileObject, expectedResult);
  });

  it("should accept TIFF from a path", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/receipt.tif"),
    });
    await inputSource.init();
    const expectedResult = await fs.promises.readFile(
      path.join(RESOURCE_PATH, "file_types/receipt.tif")
    );
    assert.strictEqual(inputSource.inputType, INPUT_TYPE_PATH);
    assert.strictEqual(inputSource.filename, "receipt.tif");
    assert.strictEqual(inputSource.mimeType, "image/tiff");
    assert.ok(!inputSource.isPdf());
    assert.strictEqual(await inputSource.getPageCount(), 1);
    assert.deepStrictEqual(inputSource.fileObject, expectedResult);
  });

  it("should accept HEIC from a path", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/receipt.heic"),
    });
    await inputSource.init();
    const expectedResult = await fs.promises.readFile(
      path.join(RESOURCE_PATH, "file_types/receipt.heic")
    );
    assert.strictEqual(inputSource.inputType, INPUT_TYPE_PATH);
    assert.strictEqual(inputSource.filename, "receipt.heic");
    assert.strictEqual(inputSource.mimeType, "image/heic");
    assert.ok(!inputSource.isPdf());
    assert.strictEqual(await inputSource.getPageCount(), 1);
    assert.deepStrictEqual(inputSource.fileObject, expectedResult);
  });

  it("should accept WEBP from a path", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/receipt.webp"),
    });
    await inputSource.init();
    const expectedResult = await fs.promises.readFile(
      path.join(RESOURCE_PATH, "file_types/receipt.webp")
    );
    assert.strictEqual(inputSource.inputType, INPUT_TYPE_PATH);
    assert.strictEqual(inputSource.filename, "receipt.webp");
    assert.strictEqual(inputSource.mimeType, "image/webp");
    assert.ok(!inputSource.isPdf());
    assert.strictEqual(await inputSource.getPageCount(), 1);
    assert.deepStrictEqual(inputSource.fileObject, expectedResult);
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
    assert.strictEqual(inputSource.inputType, INPUT_TYPE_STREAM);
    assert.strictEqual(inputSource.filename, filename);
    assert.strictEqual(inputSource.mimeType, "image/jpeg");
    assert.ok(!inputSource.isPdf());
    assert.strictEqual(await inputSource.getPageCount(), 1);
    const expectedResult = await fs.promises.readFile(filePath);
    assert.deepStrictEqual(inputSource.fileObject.toString(), expectedResult.toString());
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
      assert.fail("Should have thrown an error");
    } catch (e: any) {
      assert.ok(e instanceof MindeeInputSourceError);
      assert.strictEqual(
        e.toString(),
        "MindeeInputSourceError: Error converting stream - Error: aborted"
      );
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
      assert.fail("Should have thrown an error");
    } catch (e: any) {
      assert.ok(e instanceof MindeeInputSourceError);
      assert.strictEqual(e.toString(), "MindeeInputSourceError: Stream is already closed");
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
      assert.ok(e instanceof MindeeInputSourceError);
      assert.strictEqual(
        e.toString(),
        "MindeeInputSourceError: Error converting stream - Error: aborted"
      );
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
    assert.strictEqual(inputSource.inputType, INPUT_TYPE_BYTES);
    assert.strictEqual(inputSource.filename, filename);
    assert.strictEqual(inputSource.mimeType, "image/jpeg");
    assert.ok(!inputSource.isPdf());
    assert.strictEqual(await inputSource.getPageCount(), 1);
    const expectedResult = await fs.promises.readFile(filePath);
    assert.strictEqual(Buffer.compare(inputSource.fileObject, expectedResult), 0);
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
    assert.strictEqual(inputSource.inputType, INPUT_TYPE_BUFFER);
    assert.strictEqual(inputSource.filename, filename);
    assert.ok(inputSource.isPdf());
    it("#includeOptionalDeps", async () => {
      assert.strictEqual(await inputSource.getPageCount(), 10);
    });
    assert.ok(inputSource.fileObject instanceof Buffer);
  });

});
