// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type * as pdfLibTypes from "@cantoo/pdf-lib";
import { getMinMaxX, getMinMaxY, Polygon } from "@/geometry/index.js";
import { adjustForRotation } from "@/geometry/polygonUtils.js";
import { loadOptionalDependency } from "@/utils/index.js";

let pdfLib: typeof pdfLibTypes | null = null;

async function getPdfLib(): Promise<typeof pdfLibTypes> {
  if (!pdfLib) {
    const pdfLibImport = await loadOptionalDependency<typeof pdfLibTypes>("@cantoo/pdf-lib", "Text Embedding");
    pdfLib = (pdfLibImport as any).default || pdfLibImport;
  }
  return pdfLib!;
}

/**
 * Extracts elements from a page based off of a list of bounding boxes.
 *
 * @param pdfPage PDF Page to extract from.
 * @param polygons List of coordinates to pull the elements from.
 */
export async function extractFromPage(
  pdfPage: pdfLibTypes.PDFPage,
  polygons: Polygon[]) {
  const pdfLib = await getPdfLib();
  const { width, height } = pdfPage.getSize();
  const extractedElements :Uint8Array[] = [];
  // Manual upscale.
  // Fixes issues with the OCR.
  const qualityScale = 300/72;
  const orientation = pdfPage.getRotation().angle;

  for (const origPolygon of polygons) {
    const polygon = adjustForRotation(origPolygon, orientation);

    const tempPdf = await pdfLib.PDFDocument.create();

    const newWidth = width * (getMinMaxX(polygon).max - getMinMaxX(polygon).min);
    const newHeight = height * (getMinMaxY(polygon).max - getMinMaxY(polygon).min);
    const cropped = await tempPdf.embedPage(pdfPage, {
      left: getMinMaxX(polygon).min * width,
      right: getMinMaxX(polygon).max * width,
      top: height - (getMinMaxY(polygon).min * height),
      bottom: height - (getMinMaxY(polygon).max * height),
    });

    // Determine the final page dimensions based on orientation
    let finalWidth: number;
    let finalHeight: number;
    if (orientation === 90 || orientation === 270) {
      // For 90/270 rotations, swap width and height
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
    });

    // Draw the cropped page with rotation applied
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

    extractedElements.push(await tempPdf.save());
  }
  return extractedElements;
}
