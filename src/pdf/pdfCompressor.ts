import { logger } from "../logger";
import tmp from "tmp";
import { ExtractedPdfInfo, extractTextFromPdf } from "./pdfUtils";
import * as fs from "node:fs";
import { Poppler } from "node-poppler";

/**
 * Compresses each page of a provided PDF buffer.
 * @param pdfData The input PDF as a Buffer.
 * @param imageQuality Compression quality (70-100 for most JPG images).
 * @param forceSourceTextCompression If true, attempts to re-write detected text.
 * @param disableSourceText If true, doesn't re-apply source text to the output PDF.
 * @returns A Promise resolving to the compressed PDF as a Buffer.
 */
export async function compressPdf(
  pdfData: Buffer,
  imageQuality: number = 85,
  forceSourceTextCompression: boolean = false,
  disableSourceText: boolean = true
): Promise<Buffer> {
  if (forceSourceTextCompression) {
    if (!disableSourceText) {
      logger.warn("Re-writing PDF source-text is an EXPERIMENTAL feature.");
    } else {
      logger.warn("Source file contains text, but the disable_source_text is set to false." +
        "Resulting file will not contain any embedded text.");
    }
  } else {
    logger.warn("Found text inside of the provided PDF file. "
      + "Compression operation aborted since disableSourceText is set to 'true'."
    );
    return pdfData;
  }
  const extractedPdfInfo: ExtractedPdfInfo = await extractTextFromPdf(pdfData);
  for (let i = 0; i < extractedPdfInfo.pages.length; ++i) {
    const rasterizedPage = await rasterizePage(pdfData, i, imageQuality);

  }
  return pdfData;
}

async function rasterizePage(pdfData: Buffer, index: number, quality = 85) {
  const poppler = new Poppler();
  const tmpPdf = tmp.fileSync();
  const tempPdfPath = tmpPdf.name;

  try {
    await fs.promises.writeFile(tempPdfPath, pdfData);
    const options = {
      firstPageToConvert: index,
      lastPageToConvert: index,
      jpegFile: true,
      jpegOptions: `quality=${quality}`,
      singleFile: true
    };

    const jpegBuffer = await poppler.pdfToCairo(tempPdfPath, undefined, options);

    await fs.promises.unlink(tempPdfPath);

    return jpegBuffer;
  } catch (error) {
    console.error("Error rasterizing PDF:", error);
    throw error;
  } finally {
    tmpPdf.removeCallback();
  }
}
