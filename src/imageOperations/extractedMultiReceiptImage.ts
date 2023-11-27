import { BufferInput } from "../input";
import { ExtractedImage } from "./extractedImage";

export class ExtractedMultiReceiptImage implements ExtractedImage {
  readonly receiptId: number;
  readonly pageId: number;
  imageData: Buffer;

  constructor(imageData: Uint8Array, pageId: number, receiptId: number) {
    this.pageId = pageId;
    this.imageData = Buffer.from(imageData);
    this.receiptId = receiptId;
  }

  asSource(): BufferInput {
    return new BufferInput({
      buffer: this.imageData,
      filename: `receipt_p${this.pageId}_${this.receiptId}.pdf`,
    });
  }
}
