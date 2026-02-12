import type * as pdfLibTypes from "@cantoo/pdf-lib";
import { errorHandler } from "@/errors/handler.js";
import { PageOptions, PageOptionsOperation } from "@/input/pageOptions.js";
import { MindeeError } from "@/errors/index.js";
import { logger } from "@/logger.js";
import { loadOptionalDependency } from "@/utils/index.js";
const pdfLibImport = await loadOptionalDependency<typeof pdfLibTypes>("@cantoo/pdf-lib", "Text Embedding");
const pdfLib = (pdfLibImport as any).default || pdfLibImport;

export interface SplitPdf {
  file: Buffer;
  totalPagesRemoved: number;
}

/**
 * Cut pages from a PDF file. If pages indexes are out of bounds, it will throw an error.
 * @param file
 * @param pageOptions
 * @returns the new cut PDF file.
 */
export async function extractPages(
  file: Buffer,
  pageOptions: PageOptions
): Promise<SplitPdf> {
  const currentPdf = await pdfLib.PDFDocument.load(file, {
    ignoreEncryption: true,
    password: ""
  });

  const newPdf = await pdfLib.PDFDocument.create();

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
    keptPages.forEach((keptPage: pdfLibTypes.PDFPage) => {
      newPdf.addPage(keptPage);
    });
  } else if (pageOptions.operation === PageOptionsOperation.Remove) {
    const pagesToKeep = currentPdf
      .getPageIndices()
      .filter((v:number) => !pageIndexes.includes(v));
    const keptPages = await newPdf.copyPages(currentPdf, pagesToKeep);
    keptPages.forEach((keptPage: pdfLibTypes.PDFPage) => {
      newPdf.addPage(keptPage);
    });
  } else {
    throw new Error(`The operation ${pageOptions.operation} is not available.`);
  }
  const sumRemovedPages = pageCount - newPdf.getPageCount();
  const fileBuffer = Buffer.from(await newPdf.save());
  return { file: fileBuffer, totalPagesRemoved: sumRemovedPages };
}

/**
 * Count the number of pages in a PDF file.
 * @param file
 * @returns the number of pages in the file.
 */
export async function countPages(file: Buffer): Promise<number> {
  const currentPdf = await pdfLib.PDFDocument.load(file, {
    ignoreEncryption: true,
    password: ""
  });
  return currentPdf.getPageCount();
}
