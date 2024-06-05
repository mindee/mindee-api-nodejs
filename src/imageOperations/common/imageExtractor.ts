import { PDFDocument, PDFPage } from "pdf-lib";
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
  for (const boundingBox of polygons) {
    const tempPdf = await PDFDocument.create();

    const newWidth = width * (getMinMaxX(boundingBox).max - getMinMaxX(boundingBox).min);
    const newHeight = height * (getMinMaxY(boundingBox).max - getMinMaxY(boundingBox).min);
    const cropped = await tempPdf.embedPage(pdfPage, {
      left: getMinMaxX(boundingBox).min * width,
      right: getMinMaxX(boundingBox).max * width,
      top: height - (getMinMaxY(boundingBox).min * height),
      bottom: height - (getMinMaxY(boundingBox).max * height),
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
