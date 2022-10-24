import { errorHandler } from "../errors/handler";
import { PDFDocument } from "pdf-lib";
import { PageOptions, PageOptionsOperation } from "../inputs";
import { SplitPdf } from "./SplitPdf";
import { MindeeError } from "../errors";

/**
 * Cut pages from a pdf file. If pages index are out of bound, it will throw an error.
 * @param file
 * @param pageOptions
 * @returns the new cutted pdf file.
 */
export async function cutPdf(
  file: Buffer,
  pageOptions: PageOptions
): Promise<SplitPdf> {
  const currentPdf = await PDFDocument.load(file, {
    ignoreEncryption: true,
  });

  const newPdf = await PDFDocument.create();

  if (pageOptions.pageIndexes.length > currentPdf.getPageCount()) {
    errorHandler.throw(
      new MindeeError(
        `The total indexes of pages to cut is superior to the total page count of the file (${currentPdf.getPageCount()}).`
      )
    );
  }

  if (currentPdf.getPageCount() < pageOptions.onMinPages) {
    return { file: await newPdf.save(), totalPagesRemoved: 0 };
  }

  const pageIndexes: number[] = [];
  pageOptions.pageIndexes.forEach((pageIndex) => {
    if (pageIndex < 0) {
      pageIndexes.push(currentPdf.getPageCount() - Math.abs(pageIndex));
    } else {
      pageIndexes.push(pageIndex);
    }
  });

  if (!pageIndexes.every((v) => currentPdf.getPageIndices().includes(v))) {
    errorHandler.throw(
      new MindeeError(
        `Some indexes pages
        (${pageIndexes.join(",")})
        are not existing in the file
        (${currentPdf.getPageIndices().join(",")})`
      )
    );
  }

  if (pageOptions.operation === PageOptionsOperation.KeepOnly) {
    const keptPages = await newPdf.copyPages(currentPdf, pageIndexes);
    keptPages.forEach((keptPage) => newPdf.addPage(keptPage));
  } else if (pageOptions.operation === PageOptionsOperation.Remove) {
    const pagesToKeep = currentPdf
      .getPageIndices()
      .filter((v) => !pageIndexes.includes(v));

    const keptPages = await newPdf.copyPages(currentPdf, pagesToKeep);
    keptPages.forEach((keptPage) => newPdf.addPage(keptPage));
  } else {
    errorHandler.throw(new MindeeError("This operation is not available."));
  }

  const sumRemovedPages = currentPdf.getPageCount() - newPdf.getPageCount();

  return { file: await newPdf.save(), totalPagesRemoved: sumRemovedPages };
}
