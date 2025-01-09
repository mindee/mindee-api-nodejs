import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import { createCanvas, loadImage } from "canvas";
import { logger } from "../logger";
import { hasSourceText } from "./pdfUtils";
import * as fs from "node:fs/promises";
import sharp from "sharp";

/**
 * Compresses a PDF file.
 *
 * @param pdfData Buffer representing the content of the PDF file.
 * @param imageQuality Quality of the final file (0-1).
 * @param forceSourceTextCompression Whether to force the rendering of source pdf.
 * @param disableSourceText If the PDF has source text, whether to re-apply it to the original or not.
 *
 * @returns A Promise containing a buffer with the compressed PDF.
 */
export async function compressPdf(
  pdfData: Buffer,
  imageQuality = 0.85,
  forceSourceTextCompression = false,
  disableSourceText = true
): Promise<Buffer> {
  if (!forceSourceTextCompression && await hasSourceText(pdfData)) {
    logger.warn("MINDEE WARNING: Found text inside of the provided PDF file. "
      + "Compression operation aborted since disableSourceText is set to 'true'."
    );
    return pdfData;
  }

  const pdfDoc = await PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    await processPage(pdfDoc, pages[i], imageQuality, disableSourceText);
  }

  return Buffer.from(await pdfDoc.save());
}

/**
 * Process a single page of the PDF.
 *
 * @param pdfDoc The PDF document.
 * @param page The page to process.
 * @param imageQuality Quality for image compression (0-1).
 * @param disableSourceText Whether to disable source text.
 */
async function processPage(
  pdfDoc: PDFDocument,
  page: PDFPage,
  imageQuality: number,
  disableSourceText: boolean
): Promise<void> {
  const { width, height } = page.getSize();

  const pageImage = await generatePageImage(page, imageQuality);

  if (disableSourceText) {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height,
      color: rgb(1, 1, 1), // White background
    });
  }

  const image = await pdfDoc.embedJpg(pageImage);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });
}

/**
 * Converts a PDF page to an image buffer.
 *
 * @param page PDF Page to convert.
 * @param dpi DPI for the output image (higher values result in larger, more detailed images).
 * @returns A Promise containing the image buffer.
 */

async function pdfPageToImageBuffer(page: PDFPage, dpi: number = 300): Promise<Buffer> {
  try {
    const { width, height } = page.getSize();
    const scaleFactor = dpi / 72;

    const tempPdf = await PDFDocument.create();
    const [embeddedPage] = await tempPdf.embedPdf(page.doc, [0]);
    const tempPage = tempPdf.addPage([width * scaleFactor, height * scaleFactor]);
    tempPage.drawPage(embeddedPage, {
      width: width * scaleFactor,
      height: height * scaleFactor,
    });

    const pdfBytes = await tempPdf.save();
    const sharpBytes = sharp(pdfBytes, { density: dpi });
    const sharpPng = sharpBytes.png();
    const pngBuffer = await sharpPng
      .toBuffer();

    return pngBuffer;
  } catch (error) {
    console.error("Error converting PDF page to image:", error);
    throw error;
  }
}


/**
 * Generate an image of a PDF page.
 *
 * @param page The PDF page.
 * @param quality Image quality (0-1).
 *
 * @returns A Promise containing a JPEG buffer of the page.
 */
async function generatePageImage(page: PDFPage, quality: number): Promise<Buffer> {
  const { width, height } = page.getSize();
  const imageBuffer = await pdfPageToImageBuffer(page);
  const image = await loadImage(imageBuffer);

  const canvas = createCanvas(Math.round(width), Math.round(height));
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, Math.round(width), Math.round(height));

  return canvas.toBuffer("image/jpeg", { quality: quality });
}

// This function is not used in the provided code, but I'm including an updated version for completeness
async function pdfToImage(pdfPath: string, pageNumber: number, dpi: number): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(await fs.readFile(pdfPath));
  const page = pdfDoc.getPage(pageNumber - 1);  // PDF pages are 0-indexed
  return await pdfPageToImageBuffer(page, dpi);
}
