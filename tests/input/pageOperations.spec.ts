import {
  PathInput,
  PageOptionsOperation,
  INPUT_TYPE_PATH,
} from "@/input/index.js";
import * as fs from "fs";
import * as path from "path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { RESOURCE_PATH } from "../index.js";

describe("Input Sources - high level multi-page operations #OptionalDepsRequired", () => {
  it("should cut a PDF", async () => {
    const input = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/pdf/multipage.pdf"),
    });
    await input.applyPageOptions({
      operation: PageOptionsOperation.KeepOnly,
      pageIndexes: [0, -2, -1],
      onMinPages: 5,
    });
    assert.strictEqual(input.inputType, INPUT_TYPE_PATH);
    assert.strictEqual(input.filename, "multipage.pdf");
    assert.strictEqual(input.mimeType, "application/pdf");

    // This is how the length of the word is set in the
    // raw PDF file.
    const lengthRE = /(?<=\/FlateDecode[\s\S]\/Length )\d{1,3}/gm;

    const expectedResult = await fs.promises.readFile(
      path.join(RESOURCE_PATH, "file_types/pdf/multipage_cut-3.pdf"),
      "utf-8"
    );

    const expectedLengths = expectedResult.match(lengthRE);
    const inputDocLengths =
      input.fileObject.toString("utf-8").match(lengthRE) || [];
    assert.deepStrictEqual(inputDocLengths, expectedLengths);
  });

  it("should not cut the PDF", async () => {
    const filePath = path.join(RESOURCE_PATH, "file_types/pdf/multipage.pdf");
    const input = new PathInput({
      inputPath: filePath,
    });
    await input.init();
    const expectedResult = await fs.promises.readFile(filePath);
    assert.strictEqual(input.inputType, INPUT_TYPE_PATH);
    assert.strictEqual(input.filename, "multipage.pdf");
    assert.strictEqual(input.mimeType, "application/pdf");
    assert.deepStrictEqual(input.fileObject, expectedResult);
  });
});
