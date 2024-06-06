import { ExtractedImage } from "../common";

export class ExtractedMultiReceiptImage extends ExtractedImage {
  readonly receiptId: number;
  readonly pageId: number;

  constructor(buffer: Uint8Array, pageId: number, receiptId: number) {
    super(buffer, `receipt_p${pageId}_${receiptId}.pdf`);
    this.pageId = pageId;
    this.receiptId = receiptId;
  }
}
