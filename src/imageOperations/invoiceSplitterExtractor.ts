import { PDFDocument } from "pdf-lib";
import { MindeeError, MindeeMimeTypeError } from "../errors";
import { InvoiceSplitterV1 } from "../product";
import { LocalInputSource } from "../input/base";
import { InvoiceSplitterV1PageGroup } from "../product/invoiceSplitter/invoiceSplitterV1PageGroup";
import { ExtractedInvoiceSplitterImage } from "./extractedInvoiceSplitterDocument";

async function splitPdf(pdfDoc: PDFDocument, invoicePageGroups: InvoiceSplitterV1PageGroup[] | number[][]): Promise<ExtractedInvoiceSplitterImage[]> {
  const generatedPdfs: ExtractedInvoiceSplitterImage[] = [];
  const pageIndexes: number[][] = invoicePageGroups.map((pageGroup) => {
    if (pageGroup instanceof InvoiceSplitterV1PageGroup) {
      return pageGroup.pageIndexes;
    }
    return pageGroup;
  });
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

export async function extractSelectedInvoices(inputFile: LocalInputSource, customIndexes: number[][]): Promise<ExtractedInvoiceSplitterImage[]> {
  if (!customIndexes) {
    throw new MindeeError("No possible receipts candidates found for MultiReceipts extraction.");
  }

  const pdfDoc = await getPdfDoc(inputFile);
  const pageCount = pdfDoc.getPageCount();
  customIndexes.forEach((pageGroup) => {
    pageGroup.forEach((index) => {
      if (index > pageCount) {
        throw new MindeeError(`Input file page count (${pageCount}) didn't match that of the inference ${index}. Did the input file change?`)
      }
    })
  });
  return await splitPdf(pdfDoc, customIndexes);
}

export async function extractAllInvoices(inputFile: LocalInputSource, inference: InvoiceSplitterV1): Promise<ExtractedInvoiceSplitterImage[]> {
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
