import { errorHandler } from "../errors/handler";
import { PDFDocument } from "pdf-lib";
import { PageOptions, PageOptionsOperation } from "../input";
import { MindeeError } from "../errors";
import { logger } from "../logger";
import { Poppler } from "node-poppler";
import { readFile } from "fs/promises";
import tmp from "tmp";
import fs from "node:fs";

export interface SplitPdf {
  file: Buffer;
  totalPagesRemoved: number;
}

/**
 * Attempts to load the file using pdf-lib, and falls back to node-poppler if unable to.
 * @param file File buffer to be opened.
 */
export async function loadPdfWithFallback(file: string | Buffer) {
  const document = await PDFDocument.load(file, { ignoreEncryption: true });
  if (!document.isEncrypted) {
    return document;
  }
  const poppler = new Poppler();

  const tmpPdfOutput = tmp.fileSync();
  const tmpPdfOutputPath = tmpPdfOutput.name;

  try {
    await poppler.pdfToCairo(file, tmpPdfOutputPath, {
      pdfFile: true,
      antialias: "default",
    });

    const convertedPdf = await readFile(tmpPdfOutputPath);
    return await PDFDocument.load(convertedPdf, { ignoreEncryption: true });
  } finally {
    await fs.promises.unlink(tmpPdfOutputPath);
  }
}


/**
 * Cut pages from a pdf file. If pages index are out of bound, it will throw an error.
 * @param file
 * @param pageOptions
 * @returns the new cut pdf file.
 */
export async function extractPages(
  file: Buffer,
  pageOptions: PageOptions
): Promise<SplitPdf> {
  const currentPdf = await loadPdfWithFallback(file);

  const newPdf = await PDFDocument.create();

  const pageCount = currentPdf.getPageCount();

  if (pageCount < pageOptions.onMinPages) {
    logger.debug(`File skipped because it had less than ${pageOptions} pages (${pageCount}).`);
    return { file: file, totalPagesRemoved: 0 };
  }

  if (pageOptions.pageIndexes.length > pageCount) {
    errorHandler.throw(
      new MindeeError(
        "The total indexes of pages to cut is superior to the total page count of the file (" +
        pageCount +
        ")."
      )
    );
  }

  const pageIndexes: number[] = [];
  pageOptions.pageIndexes.forEach((pageIndex) => {
    if (pageIndex < 0) {
      pageIndexes.push(pageCount - Math.abs(pageIndex));
    } else {
      pageIndexes.push(pageIndex);
    }
  });

  if (!pageIndexes.every((v) => currentPdf.getPageIndices().includes(v))) {
    errorHandler.throw(
      new MindeeError(
        `Some indexes pages
        (${pageIndexes.join(",")})
        don't exist in the file
        (${currentPdf.getPageIndices().join(", ")})`
      )
    );
  }

  if (pageOptions.operation === PageOptionsOperation.KeepOnly) {
    const keptPages = await newPdf.copyPages(currentPdf, pageIndexes);
    keptPages.forEach((keptPage) => {
      newPdf.addPage(keptPage);
    });
  } else if (pageOptions.operation === PageOptionsOperation.Remove) {
    const pagesToKeep = currentPdf
      .getPageIndices()
      .filter((v) => !pageIndexes.includes(v));
    const keptPages = await newPdf.copyPages(currentPdf, pagesToKeep);
    keptPages.forEach((keptPage) => {
      newPdf.addPage(keptPage);
    });
  } else {
    throw new Error(`The operation ${pageOptions.operation} is not available.`);
  }
  const sumRemovedPages = pageCount - newPdf.getPageCount();
  const fileBuffer = Buffer.from(await newPdf.save());
  return { file: fileBuffer, totalPagesRemoved: sumRemovedPages };
}

export async function countPages(file: Buffer): Promise<number> {
  const currentPdf = await loadPdfWithFallback(file);
  return currentPdf.getPageCount();
}
