import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";
import { PDFExtract, PDFExtractPage } from "pdf.js-extract";
import sharp from "sharp";
import { CanvasRenderingContext2D, createCanvas, Image } from "canvas";
import { ExtractedPdfInfo, extractTextFromPdf, hasSourceText } from "./pdfUtils";
import { logger } from "../logger";

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
  imageQuality: number = 85,
  forceSourceTextCompression: boolean = false,
  disableSourceText: boolean = true
): Promise<Buffer> {
  if (!forceSourceTextCompression && await hasSourceText(pdfData) && disableSourceText) {
    logger.warn("MINDEE WARNING: Found text inside of the provided PDF file. "
      + "Compression operation aborted since disableSourceText is set to 'true'."
    );
    return pdfData;
  }

  let extractedText: ExtractedPdfInfo | null = null;

  if (disableSourceText) {
    extractedText = await extractTextFromPdf(pdfData);
  }
  const pdfDoc = await PDFDocument.load(pdfData);
  const pdfExtract = new PDFExtract();
  const extractedData = await pdfExtract.extractBuffer(pdfData);

  const compressedPages: Buffer[] = [];

  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPages()[i];
    const { width, height } = page.getSize();

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const pageData: PDFExtractPage = extractedData.pages[i];
    await renderPageToCanvas(ctx, pageData, width, height, disableSourceText);
    if (!disableSourceText) {
      await addTextToPdfPage(page, extractedText);
    }

    const compressedImage = await compressImage(canvas, imageQuality);
    compressedPages.push(compressedImage);
  }

  const newPdfDoc = await PDFDocument.create();

  for (const compressedPage of compressedPages) {
    const image = await newPdfDoc.embedPng(compressedPage);
    const page = newPdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const compressedPdfBytes = await newPdfDoc.save();
  return Buffer.from(compressedPdfBytes);
}

/**
 * Renders a PDF page to a canvas context.
 *
 * @param ctx The 2D rendering context of the canvas.
 * @param pageData The extracted page data from pdf.js-extract.
 * @param width The width of the page.
 * @param height The height of the page.
 * @param disableSourceText If the PDF has source text, whether to re-apply it to the original or not.
 */
async function renderPageToCanvas(
  ctx: CanvasRenderingContext2D,
  pageData: PDFExtractPage,
  width: number,
  height: number,
  disableSourceText: boolean
): Promise<void> {
  clearCanvas(ctx, width, height);
  await renderImages(ctx, pageData.content, height);
  renderVectorGraphics(ctx, pageData.content, height);
  if (disableSourceText) {
    renderText(ctx, pageData.content, height);
  }
}

/**
 * Clears the canvas by drawing white on it.
 * @param ctx The 2D rendering context of the canvas.
 * @param width Page width.
 * @param height Page height.
 */
function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
}

/**
 * Renders images in a canvas.
 * @param ctx The 2D rendering context of the canvas.
 * @param content Page contents.
 * @param height Page height.
 */
async function renderImages(ctx: CanvasRenderingContext2D, content: any[], height: number): Promise<void> {
  for (const item of content) {
    if (item.type === "image") {
      await drawImage(ctx, item, height);
    }
  }
}

/**
 * Draws images in a canvas once.
 * @param ctx The 2D rendering context of the canvas.
 * @param item Individual image object.
 * @param height Page height.
 */
async function drawImage(ctx: CanvasRenderingContext2D, item: any, height: number): Promise<void> {
  const img = new Image();
  img.src = item.src;
  await new Promise<void>((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, item.x, height - item.y - item.height, item.width, item.height);
      resolve();
    };
  });
}

/**
 * Renders potential vector graphics on a page.
 * @param ctx The 2D rendering context of the canvas.
 * @param content Page contents.
 * @param height Page height.
 */
function renderVectorGraphics(ctx: CanvasRenderingContext2D, content: any[], height: number): void {
  for (const item of content) {
    if (item.type === "path") {
      drawPath(ctx, item, height);
    }
  }
}

/**
 * Draws a path on the canvas.
 *
 * @param ctx The 2D rendering context of the canvas.
 * @param item Vector item to draw.
 * @param height Page Height.
 */
function drawPath(ctx: CanvasRenderingContext2D, item: any, height: number): void {
  ctx.beginPath();
  for (const op of item.ops) {
    switch (op.op) {
    case "m":
      ctx.moveTo(op.x, height - op.y);
      break;
    case "l":
      ctx.lineTo(op.x, height - op.y);
      break;
    case "c":
      ctx.bezierCurveTo(op.x1, height - op.y1, op.x2, height - op.y2, op.x, height - op.y);
      break;
    }
  }
  ctx.stroke();
}

/**
 * Render text onto the page.
 *
 * @param ctx The 2D rendering context of the canvas.
 * @param content Page contents.
 * @param height Page height.
 */
function renderText(ctx: CanvasRenderingContext2D, content: any[], height: number): void {
  for (const item of content) {
    if (item.str) {
      drawText(ctx, item, height);
    }
  }
}

/**
 * Draws rasterized text on a page.
 * @param ctx The 2D rendering context of the canvas.
 * @param item Text item.
 * @param height Page height.
 */
function drawText(ctx: CanvasRenderingContext2D, item: any, height: number): void {
  ctx.font = `${item.fontName} ${item.fontSize}px`;
  ctx.fillStyle = item.color || "black";
  ctx.fillText(item.str, item.x, height - item.y);
}


/**
 * Compresses an image using sharp.
 *
 * @param canvas The canvas containing the image to compress.
 * @param quality The quality of the compressed image (0-1).
 * @returns A Promise containing a buffer with the compressed image.
 */
async function compressImage(
  canvas: any,
  quality: number
): Promise<Buffer> {
  const pngBuffer = canvas.toBuffer("image/png");
  return await sharp(pngBuffer)
    .png({ quality: quality })
    .toBuffer();
}

async function getFontFromName(fontName: string): Promise<PDFFont> {
  const pdfDoc = await PDFDocument.create();
  let font: PDFFont;
  if (Object.values(StandardFonts).map(value => value.toString()).includes(fontName)) {
    font = await pdfDoc.embedFont(fontName);
  } else {
    font = await pdfDoc.embedFont(StandardFonts.Helvetica); // Fallback font isn't supported.
  }

  return font;
}

/**
 * Adds text to a specific page in the PDF document.
 *
 * @param page Handle for the PDF page.
 * @param textInfo The text to add.
 */
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
