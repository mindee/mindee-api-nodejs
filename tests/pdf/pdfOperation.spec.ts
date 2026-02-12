import * as pdf from "@/pdf/index.js";
import * as path from "path";
import * as fs from "fs";
import { expect } from "chai";
import { PageOptions, PageOptionsOperation } from "@/index.js";
import { PathInput } from "@/index.js";
import { RESOURCE_PATH } from "../index.js";

describe("Test pdf operation #extraDeps", () => {
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
    expect(splitPdf.totalPagesRemoved).to.eq(10);
    expect(await pdf.countPages(splitPdf.file)).to.eq(2);
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
    expect(splitPdf.totalPagesRemoved).to.eq(11);
    expect(await pdf.countPages(splitPdf.file)).to.eq(1);
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
      expect(error).to.be.an("error");
      expect(error.name).to.be.eq("MindeeError");
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
      expect(error).to.be.an("error");
      expect(error.name).to.be.eq("MindeeError");
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

    expect(splitPdf.totalPagesRemoved).to.eq(3);
    expect(await pdf.countPages(splitPdf.file)).to.eq(9);
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
    expect(splitPdf.totalPagesRemoved).to.eq(0);
    expect(await pdf.countPages(splitPdf.file)).to.eq(2);
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
    expect(splitPdf.totalPagesRemoved).to.eq(0);
    expect(await pdf.countPages(splitPdf.file)).to.eq(2);
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
    expect(newPdf.totalPagesRemoved).to.eq(9);
    expect(await pdf.countPages(newPdf.file)).to.eq(3);

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
    expect(expectedLengths).to.have.ordered.members(inputDocLengths);
  });
});
