import { PDFDocument, PDFImage, PDFPage, degrees } from "@cantoo/pdf-lib";
import { MindeeError, MindeeInputSourceError } from "@/errors/index.js";
import { Polygon } from "@/geometry/index.js";
import { MultiReceiptsDetectorV1 } from "@/v1/product/index.js";
import { ExtractedMultiReceiptImage } from "./extractedMultiReceiptImage.js";
import { LocalInputSource } from "@/input/index.js";
import { extractFromPage } from "@/image/index.js";
import { PositionField } from "@/v1/parsing/standard/index.js";

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
    throw new MindeeInputSourceError(
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
    page.setRotation(degrees(inference.pages[pageId].orientation?.value ?? 0));
    const receiptPositions = inference.pages[pageId].prediction.receipts.map(
      (receipt: PositionField) => receipt.boundingBox
    );
    const extractedReceipts = await extractReceiptsFromPage(page, receiptPositions, pageId);
    images.push(...extractedReceipts);
  }
  return images;
}
