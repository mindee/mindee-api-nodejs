import {cutPdf} from "../../src/pdf"
import * as path from "path";
import * as fs from "fs";
import {expect} from "chai";
import {PathInput, PageOptions, PageOptionsOperation} from "../../src/inputs";

describe("Test pdf operation", () => {
  it("should cut a PDF to get 2 pages", async () => {

    const inputDoc = new PathInput({
      inputPath: path.join(__dirname, "../data/pdf/multipage.pdf"),
    });
    await inputDoc.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0, 1],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 1,
    };

    const splitPdf = await cutPdf(inputDoc.fileObject, pageOptions);

    expect(await splitPdf.totalPagesRemoved)
      .to.eq(10);
  });

  it("should cut a PDF to get only the first page", async () => {
    const inputDoc = new PathInput({
      inputPath: path.join(__dirname, "../data/pdf/multipage.pdf"),
    });
    await inputDoc.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 1,
    };

    const splitPdf = await cutPdf(inputDoc.fileObject, pageOptions);

    expect(await splitPdf.totalPagesRemoved)
      .to.eq(11);
  });

  it("should not cut a PDF but throw exception because index page out of range", async () => {
    const inputDoc = new PathInput({
      inputPath: path.join(__dirname, "../data/pdf/multipage_cut-1.pdf"),
    });
    await inputDoc.init();

    const pageOptions: PageOptions = {
      pageIndexes: [10],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 1,
    };

    try {
      await cutPdf(inputDoc.fileObject, pageOptions);
    } catch (error: any) {
      expect(error).to.be.an("error");
      expect(error.name).to.be.eq("MindeeError");
    }

  });

  it("should not cut a PDF but throw exception because too many indexes compare to the total of pages", async () => {
    const inputDoc = new PathInput({
      inputPath: path.join(__dirname, "../data/pdf/multipage_cut-1.pdf"),
    });
    await inputDoc.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0, 1, 2],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 1,
    };

    try {
      await cutPdf(inputDoc.fileObject, pageOptions);
    } catch (error: any) {
      expect(error).to.be.an("error");
      expect(error.name).to.be.eq("MindeeError");
    }
  });

  it("should remove pages from a PDF", async () => {
    const inputDoc = new PathInput({
      inputPath: path.join(__dirname, "../data/pdf/multipage.pdf"),
    });
    await inputDoc.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0, 1, 2],
      operation: PageOptionsOperation.Remove,
      onMinPages: 1,
    };

    const splitPdf = await cutPdf(inputDoc.fileObject, pageOptions);

    expect(await splitPdf.totalPagesRemoved)
      .to.eq(3);
  });

  it("should not remove pages from a PDF because min pages are not met", async () => {
    const inputDoc = new PathInput({
      inputPath: path.join(__dirname, "../data/pdf/multipage_cut-2.pdf"),
    });
    await inputDoc.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0],
      operation: PageOptionsOperation.Remove,
      onMinPages: 5,
    };

    const splitPdf = await cutPdf(inputDoc.fileObject, pageOptions);

    expect(await splitPdf.totalPagesRemoved)
      .to.eq(0);
  });

  it("should not cut pages from a PDF because min pages are not met", async () => {
    const inputDoc = new PathInput({
      inputPath: path.join(__dirname, "../data/pdf/multipage_cut-2.pdf"),
    });
    await inputDoc.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 12,
    };

    const splittedPdf = await cutPdf(inputDoc.fileObject, pageOptions);

    expect(await splittedPdf.totalPagesRemoved)
      .to.eq(0);
  });

  it("should cut the first and the 2 last pages from a PDF", async () => {
    const inputDoc = new PathInput({
      inputPath: path.join(__dirname, "../data/pdf/multipage.pdf"),
    });
    await inputDoc.init();

    const pageOptions: PageOptions = {
      pageIndexes: [0, -2, -1],
      operation: PageOptionsOperation.KeepOnly,
      onMinPages: 0,
    };

    const splitPdf = await cutPdf(inputDoc.fileObject, pageOptions);

    expect(await splitPdf.totalPagesRemoved)
      .to.eq(9);

    // This is how the length of the word is set in the
    // raw PDF file.
    const lengthRE = /(?<=\/FlateDecode[\s\S]\/Length )\d{1,3}/gm;

    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "../data/pdf/multipage_cut-3.pdf"),
      "utf-8"
    );

    inputDoc.fileObject = Buffer.from(splitPdf.file);
    const expectedLengths = expectedResult.match(lengthRE);
    const inputDocLengths =
      inputDoc.fileObject.toString("utf-8").match(lengthRE) || [];
    expect(expectedLengths).to.have.ordered.members(inputDocLengths);
  });
});
