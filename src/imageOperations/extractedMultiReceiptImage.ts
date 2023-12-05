import { ExtractedImage } from "./extractedImage";

export class ExtractedMultiReceiptImage extends ExtractedImage {
  readonly receiptId: number;
  readonly pageId: number;

  constructor(imageData: Uint8Array, pageId: number, receiptId: number) {
    super(imageData, `receipt_p${pageId}_${receiptId}.pdf`);
    this.pageId = pageId;
    this.receiptId = receiptId;
  }
}
