import { PDFDocument, PDFPage } from "@cantoo/pdf-lib";
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
  for (const polygon of polygons) {
    const tempPdf = await PDFDocument.create();

    const newWidth = width * (getMinMaxX(polygon).max - getMinMaxX(polygon).min);
    const newHeight = height * (getMinMaxY(polygon).max - getMinMaxY(polygon).min);
    const cropped = await tempPdf.embedPage(pdfPage, {
      left: getMinMaxX(polygon).min * width,
      right: getMinMaxX(polygon).max * width,
      top: height - (getMinMaxY(polygon).min * height),
      bottom: height - (getMinMaxY(polygon).max * height),
    });
    const samplePage = tempPdf.addPage([newWidth, newHeight]);
    samplePage.drawPage(cropped,
      {
        width: newWidth,
        height: newHeight,
      });
    extractedElements.push(await tempPdf.save());
  }
  return extractedElements;
}
