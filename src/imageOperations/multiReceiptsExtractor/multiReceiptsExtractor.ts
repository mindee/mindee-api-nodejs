import { PDFDocument, PDFImage, PDFPage } from "@cantoo/pdf-lib";
import { MindeeError, MindeeMimeTypeError } from "../../errors";
import { Polygon } from "../../geometry";
import { MultiReceiptsDetectorV1 } from "../../product";
import { ExtractedMultiReceiptImage } from "./extractedMultiReceiptImage";
import { LocalInputSource } from "../../input";
import { extractFromPage } from "../common";
import { PositionField } from "../../parsing/standard";

/**
 * Given a page and a set of coordinates, extracts & assigns individual receipts to an ExtractedMultiReceiptImage
 * object.
 *
 * @param pdfPage PDF Page to extract from.
 * @param boundingBoxes A set of coordinates delimiting the position of each receipt.
 * @param pageId Id of the page the receipt is extracted from. Caution: this starts at 0, unlike the numbering in PDF
 * pages.
 */
async function extractReceiptsFromPage(
  pdfPage: PDFPage,
  boundingBoxes: Polygon[],
  pageId: number) {
  const extractedReceiptsRaw = await extractFromPage(pdfPage, boundingBoxes);
  const extractedReceipts = [];
  for (let i = 0; i < extractedReceiptsRaw.length; i++) {
    extractedReceipts.push(new ExtractedMultiReceiptImage(extractedReceiptsRaw[i], pageId, i));
  }
  return extractedReceipts;
}

async function loadPdfDoc(inputFile: LocalInputSource) {
  let pdfDoc: PDFDocument;
  if (!["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(inputFile.mimeType)) {
    throw new MindeeMimeTypeError(
      'Unsupported file type "' +
      inputFile.mimeType +
      '" Currently supported types are .png, .jpg and .pdf'
    );
  } else if (inputFile.isPdf()) {
    pdfDoc = await PDFDocument.load(inputFile.fileObject, {
      ignoreEncryption: true,
      password: ""
    });
  } else {
    pdfDoc = await PDFDocument.create();
    let image: PDFImage;
    if (inputFile.mimeType === "image/png") {
      image = await pdfDoc.embedPng(inputFile.fileObject);
    } else {
      image = await pdfDoc.embedJpg(inputFile.fileObject);
    }
    const imageDims = image.scale(1);
    const pageImage = pdfDoc.addPage([imageDims.width, imageDims.height]);
    pageImage.drawImage(image);
  }
  return pdfDoc;
}

/**
 * Extracts individual receipts from multi-receipts documents.
 *
 * @param inputFile File to extract sub-receipts from.
 * @param inference Results of the inference.
 * @returns Individual extracted receipts as an array of ExtractedMultiReceiptImage.
 */
export async function extractReceipts(
  inputFile: LocalInputSource,
  inference: MultiReceiptsDetectorV1
): Promise<ExtractedMultiReceiptImage[]> {
  const images: ExtractedMultiReceiptImage[] = [];
  if (!inference.prediction.receipts) {
    throw new MindeeError("No possible receipts candidates found for MultiReceipts extraction.");
  }
  const pdfDoc = await loadPdfDoc(inputFile);
  for (let pageId = 0; pageId < pdfDoc.getPageCount(); pageId++) {
    const [page] = await pdfDoc.copyPages(pdfDoc, [pageId]);
    const pageOrientation = inference.pages[pageId].orientation!.value;

    const receiptPositions = inference.pages[pageId].prediction.receipts.map(
      (receipt: PositionField) => {
        // receipt.boundingBox is in the format [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
        // it must be rotated counter clock wise based on page orientation
        if (pageOrientation === 90) {
          return [
            [receipt.boundingBox[0][1], 1 - receipt.boundingBox[0][0]],
            [receipt.boundingBox[1][1], 1 - receipt.boundingBox[1][0]],
            [receipt.boundingBox[2][1], 1 - receipt.boundingBox[2][0]],
            [receipt.boundingBox[3][1], 1 - receipt.boundingBox[3][0]],
          ] as Polygon;
        }
        if (pageOrientation === 180) {
          return [
            [1 - receipt.boundingBox[0][0], 1 - receipt.boundingBox[0][1]],
            [1 - receipt.boundingBox[1][0], 1 - receipt.boundingBox[1][1]],
            [1 - receipt.boundingBox[2][0], 1 - receipt.boundingBox[2][1]],
            [1 - receipt.boundingBox[3][0], 1 - receipt.boundingBox[3][1]],
          ] as Polygon;
        }
        if (pageOrientation === 270) {
          return [
            [1 - receipt.boundingBox[0][1], receipt.boundingBox[0][0]],
            [1 - receipt.boundingBox[1][1], receipt.boundingBox[1][0]],
            [1 - receipt.boundingBox[2][1], receipt.boundingBox[2][0]],
            [1 - receipt.boundingBox[3][1], receipt.boundingBox[3][0]],
          ] as Polygon;
        }
        return receipt.boundingBox;
      }
    );
    const extractedReceipts = await extractReceiptsFromPage(page, receiptPositions, pageId);
    images.push(...extractedReceipts);
  }
  return images;
}
