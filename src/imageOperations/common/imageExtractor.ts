import { PDFDocument, PDFPage, rgb } from "@cantoo/pdf-lib";
import { getMinMaxX, getMinMaxY, Polygon } from "../../geometry";

/**
 * Extracts elements from a page based off of a list of bounding boxes.
 *
 * @param pdfPage PDF Page to extract from.
 * @param polygons List of coordinates to pull the elements from.
 */
export async function extractFromPage(
  pdfPage: PDFPage,
  polygons: Polygon[]) {
  const { width, height } = pdfPage.getSize();
  const extractedElements :Uint8Array[] = [];
  // Manual upscale.
  // Fixes issues with the OCR.
  const qualityScale = 300/72;
  const padding = 0.02;

  for (const polygon of polygons) {
    const tempPdf = await PDFDocument.create();

    const xLimits = getMinMaxX(polygon);
    const yLimits = getMinMaxY(polygon);

    const minX = Math.max(0, xLimits.min - padding);
    const maxX = Math.min(1, xLimits.max + padding);
    const minY = Math.max(0, yLimits.min - padding);
    const maxY = Math.min(1, yLimits.max + padding);

    const newWidth = width * (maxX - minX);
    const newHeight = height * (maxY - minY);

    const cropped = await tempPdf.embedPage(pdfPage, {
      left: minX * width,
      right: maxX * width,
      top: height - (minY * height),
      bottom: height - (maxY * height),
    });
    const samplePage = tempPdf.addPage([newWidth * qualityScale, newHeight * qualityScale]);

    samplePage.drawRectangle({
      x: 0,
      y: 0,
      width: newWidth * qualityScale,
      height: newHeight * qualityScale,
      color: rgb(1, 1, 1),
    });

    samplePage.drawPage(cropped,
      {
        width: newWidth * qualityScale,
        height: newHeight * qualityScale,
      });
    extractedElements.push(await tempPdf.save());
  }
  return extractedElements;
}
