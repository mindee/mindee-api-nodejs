import { Buffer } from "node:buffer";
import { BufferInput } from "../input/sources";


export class ExtractedImage {
  readonly pageId: number;
  imageData: Buffer;

  constructor(imageData: Uint8Array, pageId: number) {
    this.pageId = pageId;
    this.imageData = Buffer.from(imageData);
  }

  asSource(): BufferInput {
    return new BufferInput({ buffer: this.imageData, filename: `receipt_p${this.pageId}.pdf` });
  }
}
