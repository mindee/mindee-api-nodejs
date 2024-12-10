import { PDFDocument } from "pdf-lib";
import { MindeeError, MindeeMimeTypeError } from "../../errors";
import { InvoiceSplitterV1 } from "../../product";
import { LocalInputSource } from "../../input";
import { ExtractedInvoiceSplitterImage } from "./extractedInvoiceSplitterImage";

async function splitPdf(pdfDoc: PDFDocument, invoicePageGroups: number[][]): Promise<ExtractedInvoiceSplitterImage[]> {
  if (invoicePageGroups.length === 0) {
    return [];
  }
  const generatedPdfs: ExtractedInvoiceSplitterImage[] = [];
  for (let i = 0; i < invoicePageGroups.length; i++) {
    const subdocument = await PDFDocument.create();
    const fullIndexes = [];
    for (let j = invoicePageGroups[i][0]; j <= invoicePageGroups[i][invoicePageGroups[i].length - 1]; j++) {
      fullIndexes.push(j);
    }
    const copiedPages = await subdocument.copyPages(pdfDoc, fullIndexes);
    copiedPages.map((page) => {
      subdocument.addPage(page);
    });
    const subdocumentBytes = await subdocument.save();
    generatedPdfs.push(new ExtractedInvoiceSplitterImage(
      subdocumentBytes,
      [invoicePageGroups[i][0], invoicePageGroups[i][invoicePageGroups[i].length - 1]]
    ));
  }

  return generatedPdfs;
}

async function getPdfDoc(inputFile: LocalInputSource): Promise<PDFDocument> {
  await inputFile.init();
  if (!inputFile.isPdf()) {
    throw new MindeeMimeTypeError("Invoice Splitter is only compatible with pdf documents.");
  }

  const pdfDoc = await PDFDocument.load(inputFile.fileObject);
  if (pdfDoc.getPageCount() < 2) {
    throw new MindeeError("Invoice Splitter is only compatible with multi-page-pdf documents.");
  }
  return pdfDoc;
}

/**
 * Extracts & cuts the pages of a main document invoice according to the provided indexes.
 *
 * @param inputFile File to extract sub-invoices from.
 * @param indexes List of indexes to cut the document according to.
 *  Can be provided either as a InvoiceSplitterV1 inference, or a direct list of splits.
 * @param strict If set to true, doesn't cut pages where the API isn't 100% confident.
 * @returns A promise of extracted images, as an array of ExtractedInvoiceSplitterImage.
 */
export async function extractInvoices(
  inputFile: LocalInputSource,
  indexes: InvoiceSplitterV1 | number[][],
  strict: boolean = false): Promise<ExtractedInvoiceSplitterImage[]> {
  if (!indexes) {
    throw new MindeeError("No possible receipts candidates found for MultiReceipts extraction.");
  }
  let customIndexes: number[][] = [];
  if (indexes instanceof InvoiceSplitterV1) {
    indexes.prediction.invoicePageGroups.map((invoicePageGroup) => {
      if (!strict || invoicePageGroup.confidence === 1) {
        customIndexes.push(invoicePageGroup.pageIndexes);
      }
    });
  } else {
    customIndexes = indexes;
  }

  const pdfDoc = await getPdfDoc(inputFile);
  const pageCount = pdfDoc.getPageCount();
  customIndexes.forEach((pageGroup) => {
    pageGroup.forEach((index) => {
      if (index >= pageCount) {
        throw new MindeeError(`Given index ${index} doesn't exist in page range (0-${pageCount - 1})`);
      }
    });
  });
  return await splitPdf(pdfDoc, customIndexes);
}
