import { ExtractedImage } from "@/image/index.js";

/**
 * Wrapper class for extracted multiple-receipts images.
 */
export class ExtractedMultiReceiptImage extends ExtractedImage {
  /** Receipt index within the source page. */
  readonly receiptId: number;
  /** Source page identifier. */
  readonly pageId: number;

  constructor(buffer: Uint8Array, pageId: number, receiptId: number) {
    super(buffer, `receipt_p${pageId}_${receiptId}.pdf`, pageId, receiptId);
    this.pageId = pageId;
    this.receiptId = receiptId;
  }
}
