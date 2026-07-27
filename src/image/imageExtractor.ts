import { loadOptionalDependency } from "@/dependency/index.js";
import { MindeeImageError } from "@/errors/index.js";
import { getMinMaxX, getMinMaxY, Polygon } from "@/geometry/index.js";
import { adjustForRotation } from "@/geometry/polygonUtils.js";
import { ExtractedImage } from "@/image/extractedImage.js";
import { ExtractedImages } from "@/image/extractedImages.js";
import { LocalInputSource } from "@/input/index.js";
import { logger } from "@/logger.js";
import { createPdfFromInputSource } from "@/pdf/pdfOperation.js";
import { rasterizePage } from "@/pdf/pdfUtils.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type * as pdfLibTypes from "@cantoo/pdf-lib";

let pdfLib: typeof pdfLibTypes | null = null;

/**
 * Load the PDF library if not already loaded.
 */
async function getPdfLib(): Promise<typeof pdfLibTypes> {
  if (!pdfLib) {
    const pdfLibImport = await loadOptionalDependency<typeof pdfLibTypes>(
      "@cantoo/pdf-lib", "Image Extraction"
    );
    pdfLib = (pdfLibImport as any).default || pdfLibImport;
  }
  return pdfLib!;
}


/**
 * Extracts elements from a PDF document based on a list of bounding boxes.
 * @param inputSource The input source to extract from.
 * @param polygonsPerPage List of polygons to extract from per page.
 * @param quality JPEG quality of extracted images.
 */
export async function extractImagesFromPolygon(
  inputSource: LocalInputSource,
  polygonsPerPage: Map<number, Polygon[]>,
  quality?: number
): Promise<ExtractedImages> {
  const allExtractedImages: ExtractedImages = new ExtractedImages();
  const pdfDoc = await createPdfFromInputSource(inputSource);

  for (const [pageId, polygons] of polygonsPerPage) {
    logger.debug(`Extracting images from page ${pageId}`);
    const pdfPage = pdfDoc.getPage(pageId);
    const extractions = await extractFromPage(pdfPage, polygons, true, quality);
    const extractedImages = extractions.map(
      (buffer, elementId) =>
        new ExtractedImage(buffer, inputSource.filename + `_page${pageId}-${elementId}.jpg`, pageId, elementId)
    );
    allExtractedImages.push(...extractedImages);
  }
  return allExtractedImages;
}

/**
 * Helper function to handle the drawing math and orientation.
 */
function drawOrientedPage(
  pdfLib: any,
  samplePage: pdfLibTypes.PDFPage,
  cropped: pdfLibTypes.PDFEmbeddedPage,
  orientation: number,
  finalWidth: number,
  finalHeight: number,
  scaledWidth: number,
  scaledHeight: number
) {
  if (orientation === 0) {
    samplePage.drawPage(cropped, {
      width: scaledWidth,
      height: scaledHeight,
    });
  } else if (orientation === 90) {
    samplePage.drawPage(cropped, {
      x: 0,
      y: finalHeight,
      width: scaledWidth,
      height: scaledHeight,
      rotate: pdfLib.degrees(270),
    });
  } else if (orientation === 180) {
    samplePage.drawPage(cropped, {
      x: finalWidth,
      y: finalHeight,
      width: scaledWidth,
      height: scaledHeight,
      rotate: pdfLib.degrees(180),
    });
  } else if (orientation === 270) {
    samplePage.drawPage(cropped, {
      x: finalWidth,
      y: 0,
      width: scaledWidth,
      height: scaledHeight,
      rotate: pdfLib.degrees(90),
    });
  }
}

/**
 * Extract images from a PDF page.
 * @param pdfPage The PDF page to extract images from.
 * @param polygons The polygons to extract images from.
 * @param asImage Whether to return the extracted images as images or as raw data.
 * @param quality The quality of the extracted images.
 */
export async function extractFromPage(
  pdfPage: pdfLibTypes.PDFPage,
  polygons: Polygon[],
  asImage: boolean = false,
  quality?: number,
) {
  const pdfLib = await getPdfLib();
  const { width, height } = pdfPage.getSize();
  const extractedElements: Uint8Array[] = [];
  if (quality !== undefined) {
    if (quality < 0) {
      throw new MindeeImageError("Quality must be a number between 0 and 1");
    }
    if (quality > 1) {
      logger.warn("Quality is greater than 1, this operation will apply a manual upscale on the output." +
        " Use only if you know what you are doing.");
    }
  }

  const qualityScale = quality ?? 1;
  const orientation = pdfPage.getRotation().angle;
  const sourceDoc = pdfPage.doc;
  const pageIndex = sourceDoc.getPages().indexOf(pdfPage);

  for (const origPolygon of polygons) {
    logger.debug(`Extracting image with polygon: ${origPolygon.toString()}`);

    const tempPdf = await pdfLib.PDFDocument.create();
    const [copiedPage] = await tempPdf.copyPages(sourceDoc, [pageIndex]);
    const polygon = adjustForRotation(origPolygon, orientation);

    const minX = getMinMaxX(polygon).min;
    const maxX = getMinMaxX(polygon).max;
    const minY = getMinMaxY(polygon).min;
    const maxY = getMinMaxY(polygon).max;

    const newWidth = width * (maxX - minX);
    const newHeight = height * (maxY - minY);

    const cropped = await tempPdf.embedPage(copiedPage, {
      left: minX * width,
      right: maxX * width,
      top: height - (minY * height),
      bottom: height - (maxY * height),
    });

    const isVertical = orientation === 90 || orientation === 270;
    const finalWidth = (isVertical ? newHeight : newWidth) * qualityScale;
    const finalHeight = (isVertical ? newWidth : newHeight) * qualityScale;

    const samplePage = tempPdf.addPage([finalWidth, finalHeight]);
    samplePage.drawRectangle({
      x: 0, y: 0, width: finalWidth, height: finalHeight, color: pdfLib.rgb(1, 1, 1),
    });

    drawOrientedPage(
      pdfLib,
      samplePage,
      cropped,
      orientation,
      finalWidth,
      finalHeight,
      newWidth * qualityScale,
      newHeight * qualityScale
    );

    const pdfBuffer = Buffer.from(await tempPdf.save());
    extractedElements.push(asImage ? await rasterizePage(pdfBuffer, 0, 100) : pdfBuffer);
  }

  return extractedElements;
}
