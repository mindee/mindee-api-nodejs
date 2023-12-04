import { PDFDocument, PDFImage, PDFPage } from "pdf-lib";
import { MindeeError, MindeeMimeTypeError } from "../errors";
import { Polygon, getMinMaxX, getMinMaxY } from "../geometry";
import { MultiReceiptsDetectorV1 } from "../product";
import { ExtractedMultiReceiptImage } from "./extractedMultiReceiptImage";
import { LocalInputSource } from "../input/base";

async function addPage(
  pdfPage: PDFPage,
  boundingBox: Polygon,
  pageId: number,
  receiptId: number) {
  const { width, height } = pdfPage.getSize();
  const receiptPdf = await PDFDocument.create();

  const newWidth = width * (getMinMaxX(boundingBox).max - getMinMaxX(boundingBox).min);
  const newHeight = height * (getMinMaxY(boundingBox).max - getMinMaxY(boundingBox).min);
  const croppedReceipt = await receiptPdf.embedPage(pdfPage, {
    left: getMinMaxX(boundingBox).min * width,
    right: getMinMaxX(boundingBox).max * width,
    top: height - (getMinMaxY(boundingBox).min * height),
    bottom: height - (getMinMaxY(boundingBox).max * height),
  });
  const receiptPage = receiptPdf.addPage([newWidth, newHeight]);
  receiptPage.drawPage(croppedReceipt,
    {
      width: newWidth,
      height: newHeight,
    });
  const receiptBytes = await receiptPdf.save();
  return new ExtractedMultiReceiptImage(receiptBytes, pageId, receiptId);
}

async function loadPdfDoc(inputFile: LocalInputSource) {
  let pdfDoc: PDFDocument;
  if (!["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(inputFile.mimeType)) {
    throw new MindeeMimeTypeError(`Unsupported file type "${inputFile.mimeType}" Currently supported types are .png, .jpg and .pdf`);
  }
  else if (inputFile.isPdf()) {
    pdfDoc = await PDFDocument.load(inputFile.fileObject);
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

export async function extractReceipts(inputFile: LocalInputSource, inference: MultiReceiptsDetectorV1): Promise<ExtractedMultiReceiptImage[]> {
  const images: ExtractedMultiReceiptImage[] = [];
  if (!inference.prediction.receipts) {
    throw new MindeeError("No possible receipts candidates found for MultiReceipts extraction.");
  }
  const pdfDoc = await loadPdfDoc(inputFile);
  for (let pageId = 0; pageId < pdfDoc.getPageCount(); pageId++) {
    const [page] = await pdfDoc.copyPages(pdfDoc, [pageId]);
    for (let receiptId = 0; receiptId < inference.pages[pageId].prediction.receipts.length; receiptId++) {
      const receipt = inference.pages[pageId].prediction.receipts[receiptId];
      images.push(await addPage(page, receipt.boundingBox, pageId, receiptId));
    }
  }
  return images;
}
