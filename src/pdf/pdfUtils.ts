import { PDFExtract, PDFExtractOptions, PDFExtractResult } from "pdf.js-extract";
import { MindeePdfError } from "../errors/mindeeError";


export interface PageTextInfo {
  pageNumber: number;
  content: Array<{
    str: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontName: string;
  }>;
}

export interface ExtractedPdfInfo {
  pages: PageTextInfo[];
  getConcatenatedText: () => string;
}


function getConcatenatedText(pages: PageTextInfo[]): string {
  return pages.flatMap(
    page => page.content.map(
      item => item.str)
  ).join(" ");
}

/**
 * Extracts text from a full PDF document.
 *
 * @returns A Promise containing the extracted text as a string.
 * @param pdfBuffer PDF handle, as a buffer.
 */
export async function extractTextFromPdf(pdfBuffer: Buffer): Promise<ExtractedPdfInfo> {
  const pdfExtract = new PDFExtract();
  const options: PDFExtractOptions = {};

  const pdf = await new Promise<PDFExtractResult>((resolve, reject) => {
    pdfExtract.extractBuffer(pdfBuffer, options, (err, result) => {
      if (err) reject(err);
      if (result === undefined)
        reject(new MindeePdfError("Couldn't process result."));
      else resolve(result);
    });
  });

  const pages = pdf.pages.map((page, index) => ({
    pageNumber: index + 1,
    content: page.content.map(item => ({
      str: item.str,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      fontName: item.fontName,
    })),
  }));

  return {
    pages,
    getConcatenatedText: () => getConcatenatedText(pages),
  };
}





/**
 * Checks if a PDF contains source text.
 *
 * @param pdfData Buffer representing the content of the PDF file.
 *
 * @returns A Promise containing a boolean indicating if the PDF has source text.
 */
export async function hasSourceText(pdfData: Buffer): Promise<boolean> {
  const text = await extractTextFromPdf(pdfData);
  return text.getConcatenatedText().trim().length > 0;
}
