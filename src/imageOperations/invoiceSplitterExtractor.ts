import { PDFDocument } from "pdf-lib";
import { MindeeError, MindeeMimeTypeError } from "../errors";
import { InvoiceSplitterV1 } from "../product";
import { LocalInputSource } from "../input/base";
import { InvoiceSplitterV1PageGroup } from "src/product/invoiceSplitter/invoiceSplitterV1PageGroup";
import { ExtractedInvoiceSplitterImage } from "./extractedInvoiceSplitterImage";

async function splitPdf(pdfDoc: PDFDocument, invoicePageGroups: InvoiceSplitterV1PageGroup[]): Promise<ExtractedInvoiceSplitterImage[]> {
  const generatedPdfs: ExtractedInvoiceSplitterImage[] = [];
  const pageIndexes: number[][] = invoicePageGroups.map((pageGroup) => pageGroup.pageIndexes);
  for (let i = 0; i < pageIndexes.length; i++) {
    const subdocument = await PDFDocument.create();
    const copiedPages = await subdocument.copyPages(pdfDoc, pageIndexes[i]);
    copiedPages.map((page) => {
      subdocument.addPage(page);
    });
    const subdocumentBytes = await subdocument.save();
    generatedPdfs.push(new ExtractedInvoiceSplitterImage(subdocumentBytes, [pageIndexes[i][0], pageIndexes[i][pageIndexes[i].length - 1]]));
  }

  return generatedPdfs;
}

async function getPdfDoc(inputFile: LocalInputSource): Promise<PDFDocument> {
  if (!inputFile.isPdf()) {
    throw new MindeeMimeTypeError("Invoice Splitter is only compatible with multi-page-pdf documents.");
  }

  const pdfDoc = await PDFDocument.load(inputFile.fileObject);
  if (pdfDoc.getPageCount() < 2) {
    throw new MindeeError("Invoice Splitter is only compatible with multi-page-pdf documents.");
  }
  return pdfDoc;
}

export async function extractInvoices(inputFile: LocalInputSource, inference: InvoiceSplitterV1): Promise<ExtractedInvoiceSplitterImage[]> {
  if (!inference.prediction.invoicePageGroups) {
    throw new MindeeError("No possible receipts candidates found for MultiReceipts extraction.");
  }
  const pdfDoc = await getPdfDoc(inputFile);
  const pageCount = pdfDoc.getPageCount();
  inference.prediction.invoicePageGroups.forEach((pageGroup) => {
    pageGroup.pageIndexes.forEach((index) => {
      if (index > pageCount) {
        throw new MindeeError(`Input file page count (${pageCount}) didn't match that of the inference ${index}. Did the input file change?`)
      }
    })
  });
  return await splitPdf(pdfDoc, inference.prediction.invoicePageGroups);
}
