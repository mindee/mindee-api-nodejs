// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type * as pdfJsExtractTypes from "pdf.js-extract";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type * as popplerTypes from "node-poppler";
import tmp from "tmp";
import * as fs from "node:fs";
import { MindeePdfError } from "@/errors/index.js";
import { loadOptionalDependency } from "@/dependency/index.js";
import { logger } from "@/logger.js";


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
  const pdfJsExtract = await loadOptionalDependency<typeof pdfJsExtractTypes>(
    "pdf.js-extract", "PDF text extraction"
  );
  const pdfJs = (pdfJsExtract as any).pdfjs || pdfJsExtract;
  const pdfExtract: pdfJsExtractTypes.PDFExtract = new pdfJs.PDFExtract();
  const options: pdfJsExtractTypes.PDFExtractOptions = {};

  const pdf = await new Promise<pdfJsExtractTypes.PDFExtractResult>((resolve, reject) => {
    pdfExtract.extractBuffer(
      pdfBuffer, options, (
        err: Error | null, result: pdfJsExtractTypes.PDFExtractResult | undefined
      ) => {
        if (err) reject(err);
        if (result === undefined)
          reject(new MindeePdfError("Couldn't process result."));
        else resolve(result);
      });
  });

  const pages = pdf.pages.map((page: pdfJsExtractTypes.PDFExtractPage, index: number) => ({
    pageNumber: index + 1,
    content: page.content.map((item: pdfJsExtractTypes.PDFExtractText) => ({
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

/**
 * Rasterizes a PDF page.
 *
 * @param pdfData Buffer representation of the entire PDF file.
 * @param index Index of the page to rasterize.
 * @param quality Quality to apply during rasterization.
 * @return Buffer containing the rasterized image data.
 */
export async function rasterizePage(
  pdfData: Buffer, index: number, quality = 85
): Promise<Buffer> {
  const popplerImport = await loadOptionalDependency<typeof popplerTypes>(
    "node-poppler", "Image Processing"
  );
  const poppler = (popplerImport as any).default || popplerImport;
  const popplerInstance = new poppler.Poppler();
  const tmpPdf = tmp.fileSync();
  const tempPdfPath = tmpPdf.name;
  const antialiasOption: "fast" | "best" | "default" | "good" | "gray" | "none" | "subpixel" = "best";
  try {
    await fs.promises.writeFile(tempPdfPath, pdfData);
    const options = {
      antialias: antialiasOption,
      firstPageToConvert: index,
      lastPageToConvert: index,
      jpegFile: true,
      jpegOptions: `quality=${quality}`,
      singleFile: true
    };

    const jpegBuffer = await popplerInstance.pdfToCairo(tempPdfPath, undefined, options);

    await fs.promises.unlink(tempPdfPath);

    return Buffer.from(jpegBuffer, "binary");
  } catch (error) {
    logger.error("Error rasterizing PDF:", error);
    throw error;
  } finally {
    tmpPdf.removeCallback();
  }
}
