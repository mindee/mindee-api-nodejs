import * as pdf from "@/pdf/index.js";
import * as path from "path";
import * as fs from "fs";
import assert from "node:assert/strict";
import { PageOptions, PageOptionsOperation } from "@/index.js";
import { PathInput } from "@/index.js";
import { RESOURCE_PATH } from "../index.js";

describe("Test PDF operation #includeOptionalDeps", () => {
  it("should cut a PDF to get 2 pages", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/pdf/multipage.pdf"),
    });
    await inputSource.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0, 1],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 1,
    };
    const splitPdf = await pdf.extractPages(inputSource.fileObject, pageOptions);
    assert.strictEqual(splitPdf.totalPagesRemoved, 10);
    assert.strictEqual(await pdf.countPages(splitPdf.file), 2);
  });

  it("should cut a PDF to get only the first page", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/pdf/multipage.pdf"),
    });
    await inputSource.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 1,
    };
    const splitPdf = await pdf.extractPages(inputSource.fileObject, pageOptions);
    assert.strictEqual(splitPdf.totalPagesRemoved, 11);
    assert.strictEqual(await pdf.countPages(splitPdf.file), 1);
  });

  it("should not cut a PDF but throw exception because index page out of range", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/pdf/multipage_cut-1.pdf"),
    });
    await inputSource.init();

    const pageOptions: PageOptions = {
      pageIndexes: [10],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 1,
    };
    try {
      await pdf.extractPages(inputSource.fileObject, pageOptions);
    } catch (error: any) {
      assert.ok(error instanceof Error);
      assert.strictEqual(error.name, "MindeeError");
    }
  });

  it("should not cut a PDF but throw exception because too many indexes compare to the total of pages", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/pdf/multipage_cut-1.pdf"),
    });
    await inputSource.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0, 1, 2],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 1,
    };

    try {
      await pdf.extractPages(inputSource.fileObject, pageOptions);
    } catch (error: any) {
      assert.ok(error instanceof Error);
      assert.strictEqual(error.name, "MindeeError");
    }
  });

  it("should remove pages from a PDF", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/pdf/multipage.pdf"),
    });
    await inputSource.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0, 1, 2],
      operation: PageOptionsOperation.Remove,
      onMinPages: 1,
    };

    const splitPdf = await pdf.extractPages(inputSource.fileObject, pageOptions);

    assert.strictEqual(splitPdf.totalPagesRemoved, 3);
    assert.strictEqual(await pdf.countPages(splitPdf.file), 9);
  });

  it("should not remove pages from a PDF because min pages are not met", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/pdf/multipage_cut-2.pdf"),
    });
    await inputSource.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0],
      operation: PageOptionsOperation.Remove,
      onMinPages: 5,
    };
    const splitPdf = await pdf.extractPages(inputSource.fileObject, pageOptions);
    assert.strictEqual(splitPdf.totalPagesRemoved, 0);
    assert.strictEqual(await pdf.countPages(splitPdf.file), 2);
  });

  it("should not cut pages from a PDF because min pages are not met", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/pdf/multipage_cut-2.pdf"),
    });
    await inputSource.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0, 1, 3, 4],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 12,
    };
    const splitPdf = await pdf.extractPages(inputSource.fileObject, pageOptions);
    assert.strictEqual(splitPdf.totalPagesRemoved, 0);
    assert.strictEqual(await pdf.countPages(splitPdf.file), 2);
  });

  it("should cut the first and the 2 last pages from a PDF", async () => {
    const inputSource = new PathInput({
      inputPath: path.join(RESOURCE_PATH, "file_types/pdf/multipage.pdf"),
    });
    await inputSource.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0, -2, -1],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 0,
    };
    const newPdf = await pdf.extractPages(inputSource.fileObject, pageOptions);
    assert.strictEqual(newPdf.totalPagesRemoved, 9);
    assert.strictEqual(await pdf.countPages(newPdf.file), 3);

    // This is how the length of the word is set in the
    // raw PDF file.
    const lengthRE = /(?<=\/FlateDecode[\s\S]\/Length )\d{1,3}/gm;

    const expectedResult = await fs.promises.readFile(
      path.join(RESOURCE_PATH, "file_types/pdf/multipage_cut-3.pdf"),
      "utf-8"
    );

    inputSource.fileObject = Buffer.from(newPdf.file);
    const expectedLengths = expectedResult.match(lengthRE);
    const inputDocLengths =
      inputSource.fileObject.toString("utf-8").match(lengthRE) || [];
    assert.deepStrictEqual(inputDocLengths, expectedLengths);
  });
});
