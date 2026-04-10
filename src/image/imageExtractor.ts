// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type * as pdfLibTypes from "@cantoo/pdf-lib";
import { getMinMaxX, getMinMaxY, Polygon } from "@/geometry/index.js";
import { adjustForRotation } from "@/geometry/polygonUtils.js";
import { loadOptionalDependency } from "@/dependency/index.js";
import { LocalInputSource } from "@/input/index.js";
import { ExtractedImage } from "@/image/extractedImage.js";
import { createPdfFromInputSource } from "@/pdf/pdfOperation.js";
import { logger } from "@/logger.js";
import { rasterizePage } from "@/pdf/pdfUtils.js";

let pdfLib: typeof pdfLibTypes | null = null;

async function getPdfLib(): Promise<typeof pdfLibTypes> {
  if (!pdfLib) {
    const pdfLibImport = await loadOptionalDependency<typeof pdfLibTypes>(
      "@cantoo/pdf-lib", "Text Embedding"
    );
    pdfLib = (pdfLibImport as any).default || pdfLibImport;
  }
  return pdfLib!;
}


/**
 * Extracts elements from a PDF document based on a list of bounding boxes.
 * @param inputSource The input source to extract from.
 * @param polygonsPerPage List of polygons to extract from per page.
 * @param upscale Whether to upscale the image.
 */
export async function extractImagesFromPolygon(
  inputSource: LocalInputSource,
  polygonsPerPage: Map<number, Polygon[]>,
  upscale: boolean = false
) {
  const allExtractedImages: ExtractedImage[] = [];
  const pdfDoc = await createPdfFromInputSource(inputSource);

  for (const [pageId, polygons] of polygonsPerPage) {
    logger.debug(`Extracting images from page ${pageId}`);
    const pdfPage = pdfDoc.getPage(pageId);
    const extractions = (await extractFromPage(pdfPage, polygons, true, upscale));
    const extractedImages = extractions.map(
      (v, i) => new ExtractedImage(v, inputSource.filename + `_page${pageId}-${i}.jpg`, pageId, i)
    );
    allExtractedImages.push(...extractedImages);
  }
  return allExtractedImages;
}

/**
 * Extracts elements from a page based off of a list of bounding boxes.
 *
 * @param pdfPage PDF Page to extract from.
 * @param polygons List of coordinates to pull the elements from.
 * @param asImage Whether to return the extracted elements as images.
 * @param upscale Whether to upscale the image.
 */
export async function extractFromPage(
  pdfPage: pdfLibTypes.PDFPage,
  polygons: Polygon[],
  asImage: boolean = false,
  upscale: boolean = true
) {
  const pdfLib = await getPdfLib();
  const { width, height } = pdfPage.getSize();
  const extractedElements: Uint8Array[] = [];

  const qualityScale = upscale ? 300 / 72 : 1;
  const orientation = pdfPage.getRotation().angle;

  const sourceDoc = pdfPage.doc;
  const pageIndex = sourceDoc.getPages().indexOf(pdfPage);

  for (const origPolygon of polygons) {
    logger.debug(`Extracting image with polygon: ${origPolygon.toString()}`);

    const tempPdf = await pdfLib.PDFDocument.create();

    const [copiedPage] = await tempPdf.copyPages(sourceDoc, [pageIndex]);

    const polygon = adjustForRotation(origPolygon, orientation);

    const newWidth = width * (getMinMaxX(polygon).max - getMinMaxX(polygon).min);
    const newHeight = height * (getMinMaxY(polygon).max - getMinMaxY(polygon).min);

    const cropped = await tempPdf.embedPage(copiedPage, {
      left: getMinMaxX(polygon).min * width,
      right: getMinMaxX(polygon).max * width,
      top: height - (getMinMaxY(polygon).min * height),
      bottom: height - (getMinMaxY(polygon).max * height),
    });

    let finalWidth: number;
    let finalHeight: number;
    if (orientation === 90 || orientation === 270) {
      finalWidth = newHeight * qualityScale;
      finalHeight = newWidth * qualityScale;
    } else {
      finalWidth = newWidth * qualityScale;
      finalHeight = newHeight * qualityScale;
    }

    const samplePage = tempPdf.addPage([finalWidth, finalHeight]);
    samplePage.drawRectangle({
      x: 0,
      y: 0,
      width: finalWidth,
      height: finalHeight,
      color: pdfLib.rgb(1, 1, 1),
    });

    if (orientation === 0) {
      samplePage.drawPage(cropped, {
        width: newWidth * qualityScale,
        height: newHeight * qualityScale,
      });
    } else if (orientation === 90) {
      samplePage.drawPage(cropped, {
        x: 0,
        y: finalHeight,
        width: newWidth * qualityScale,
        height: newHeight * qualityScale,
        rotate: pdfLib.degrees(270),
      });
    } else if (orientation === 180) {
      samplePage.drawPage(cropped, {
        x: finalWidth,
        y: finalHeight,
        width: newWidth * qualityScale,
        height: newHeight * qualityScale,
        rotate: pdfLib.degrees(180),
      });
    } else if (orientation === 270) {
      samplePage.drawPage(cropped, {
        x: finalWidth,
        y: 0,
        width: newWidth * qualityScale,
        height: newHeight * qualityScale,
        rotate: pdfLib.degrees(90),
      });
    }

    const pdfBuffer = Buffer.from(await tempPdf.save());
    if (asImage) {
      extractedElements.push(await rasterizePage(pdfBuffer, 0, 100));
    } else {
      extractedElements.push(pdfBuffer);
    }
  }

  return extractedElements;
}
