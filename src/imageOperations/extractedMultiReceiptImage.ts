import { BufferInput } from "../input";
import { ExtractedImage } from "./extractedImage";

export class ExtractedMultiReceiptImage extends ExtractedImage {
  readonly receiptId: number;

  constructor(imageData: Uint8Array, pageId: number, receiptId: number) {
    super(imageData, pageId);
    this.receiptId = receiptId;
  }

  asSource(): BufferInput {
    return new BufferInput({
      buffer: this.imageData,
      filename: `receipt_p${this.pageId}_${this.receiptId}.pdf`,
    });
  }
}
