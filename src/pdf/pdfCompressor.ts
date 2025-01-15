import { logger } from "../logger";
import tmp from "tmp";
import { ExtractedPdfInfo, extractTextFromPdf, hasSourceText } from "./pdfUtils";
import * as fs from "node:fs";
import { Poppler } from "node-poppler";
import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";
import { compressImage } from "../imageOperations";

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
  handleCompressionWarnings(forceSourceTextCompression, disableSourceText);
  if (await hasSourceText(pdfData)) {
    if (forceSourceTextCompression) {
      if (!disableSourceText) {
        logger.warn("Re-writing PDF source-text is an EXPERIMENTAL feature.");
      } else {
        logger.warn("Source file contains text, but disable_source_text flag. " +
          "is set to false. Resulting file will not contain any embedded text.");
      }
    } else {
      logger.warn("Found text inside of the provided PDF file. Compression operation aborted since disableSourceText "
        + "is set to 'true'."
      );
      return pdfData;
    }
  }

  const extractedText = disableSourceText ? await extractTextFromPdf(pdfData) : null;
  const extractedPdfInfo: ExtractedPdfInfo = await extractTextFromPdf(pdfData);

  const compressedPages = await compressPdfPages(
    pdfData,
    extractedPdfInfo,
    imageQuality,
    disableSourceText,
    extractedText
  );

  if (!compressedPages) {
    logger.warn("Could not compress PDF to a smaller size. Returning original PDF.");
    return pdfData;
  }

  return createNewPdfFromCompressedPages(compressedPages);
}

/**
 * Handles compression warnings based on the provided parameters.
 * @param forceSourceTextCompression If true, attempts to re-write detected text.
 * @param disableSourceText If true, doesn't re-apply source text to the output PDF.
 */
function handleCompressionWarnings(forceSourceTextCompression: boolean, disableSourceText: boolean): void {
  if (forceSourceTextCompression) {
    if (!disableSourceText) {
      logger.warn("Re-writing PDF source-text is an EXPERIMENTAL feature.");
    } else {
      logger.warn("Source file contains text, but the disable_source_text is set to false. "
        + "Resulting file will not contain any embedded text.");
    }
  }
}

/**
 * Compresses PDF pages and returns an array of compressed page buffers.
 * @param pdfData The input PDF as a Buffer.
 * @param extractedPdfInfo Extracted PDF information.
 * @param imageQuality Initial compression quality.
 * @param disableSourceText If true, doesn't re-apply source text to the output PDF.
 * @param extractedText Extracted text from the PDF.
 * @returns A Promise resolving to an array of compressed page buffers, or null if compression fails.
 */
async function compressPdfPages(
  pdfData: Buffer,
  extractedPdfInfo: ExtractedPdfInfo,
  imageQuality: number,
  disableSourceText: boolean,
  extractedText: ExtractedPdfInfo | null
): Promise<Buffer[] | null> {
  const originalSize = pdfData.length;
  const MIN_QUALITY = 1;
  let imageQualityLoop = imageQuality;

  while (imageQualityLoop >= MIN_QUALITY) {
    const compressedPages = await compressPagesWithQuality(
      pdfData,
      extractedPdfInfo,
      imageQualityLoop,
      disableSourceText,
      extractedText
    );
    const totalCompressedSize = calculateTotalCompressedSize(compressedPages);

    if (isCompressionSuccessful(totalCompressedSize, originalSize, imageQuality)) {
      return compressedPages;
    }

    imageQualityLoop -= Math.round(lerp(1, 10, imageQualityLoop / 100));
  }

  return null;
}

/**
 * Compresses pages with a specific quality.
 * @param pdfData The input PDF as a Buffer.
 * @param extractedPdfInfo Extracted PDF information.
 * @param imageQuality Compression quality.
 * @param disableSourceText If true, doesn't re-apply source text to the output PDF.
 * @param extractedText Extracted text from the PDF.
 * @returns A Promise resolving to an array of compressed page buffers.
 */
async function compressPagesWithQuality(
  pdfData: Buffer,
  extractedPdfInfo: ExtractedPdfInfo,
  imageQuality: number,
  disableSourceText: boolean,
  extractedText: ExtractedPdfInfo | null
): Promise<Buffer[]> {
  const pdfDoc = await PDFDocument.load(pdfData);
  const compressedPages: Buffer[] = [];

  for (let i = 0; i < extractedPdfInfo.pages.length; i++) {
    const page = pdfDoc.getPages()[i];
    const rasterizedPage = await rasterizePage(pdfData, i + 1, imageQuality);
    const compressedImage = await compressImage(Buffer.from(rasterizedPage, "binary"), imageQuality);

    if (!disableSourceText) {
      await addTextToPdfPage(page, extractedText);
    }

    compressedPages.push(compressedImage);
  }

  return compressedPages;
}

/**
 * Calculates the total size of compressed pages.
 * @param compressedPages Array of compressed page buffers.
 * @returns The total size of compressed pages.
 */
function calculateTotalCompressedSize(compressedPages: Buffer[]): number {
  return compressedPages.reduce((sum, page) => sum + page.length, 0);
}

/**
 * Checks if the compression was successful based on the compressed size and original size.
 * Note: Not quite sure how or why the rasterization quality ratio is correlated with the overhead generated by the
 * image's inclusion into the pdf data, but this makes the following lerp() necessary if we want consistency during
 * compression.
 *
 * @param totalCompressedSize Total size of compressed pages.
 * @param originalSize Original PDF size.
 * @param imageQuality Compression quality.
 * @returns True if compression was successful, false otherwise.
 */
function isCompressionSuccessful(totalCompressedSize: number, originalSize: number, imageQuality: number): boolean {
  const overhead = lerp(0.54, 0.18, imageQuality / 100);
  return totalCompressedSize + totalCompressedSize * overhead < originalSize;
}

/**
 * Creates a new PDF document from compressed page buffers.
 * @param compressedPages Array of compressed page buffers.
 * @returns A Promise resolving to the new PDF as a Buffer.
 */
async function createNewPdfFromCompressedPages(compressedPages: Buffer[]): Promise<Buffer> {
  const newPdfDoc = await PDFDocument.create();

  for (const compressedPage of compressedPages) {
    const image = await newPdfDoc.embedJpg(compressedPage);
    const newPage = newPdfDoc.addPage([image.width, image.height]);
    newPage.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const compressedPdfBytes = await newPdfDoc.save();
  return Buffer.from(compressedPdfBytes);
}

async function addTextToPdfPage(
  page: PDFPage,
  textInfo: ExtractedPdfInfo | null
): Promise<void> {
  if (textInfo === null) {
    return;
  }
  for (const textPages of textInfo.pages) {
    for (const textPage of textPages.content) {
      page.drawText(textPage.str, {
        x: textPage.x,
        y: textPage.y,
        size: textPage.height,
        color: rgb(0, 0, 0),
        font: await getFontFromName(textPage.fontName)
      });
    }
  }
}

async function getFontFromName(fontName: string): Promise<PDFFont> {
  const pdfDoc = await PDFDocument.create();
  let font: PDFFont;
  if (Object.values(StandardFonts).map(value => value.toString()).includes(fontName)) {
    font = await pdfDoc.embedFont(fontName);
  } else {
    font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  }

  return font;
}

async function rasterizePage(pdfData: Buffer, index: number, quality = 85): Promise<string> {
  const poppler = new Poppler();
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

/**
 * Performs linear interpolation between two numbers.
 * @param start The starting value.
 * @param end The ending value.
 * @param t The interpolation factor (0 to 1).
 * @returns The interpolated value.
 */
function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

