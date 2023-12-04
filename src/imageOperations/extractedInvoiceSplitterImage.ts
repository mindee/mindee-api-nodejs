import { BufferInput } from "../input";
import { ExtractedImage } from "./extractedImage";

export class ExtractedInvoiceSplitterImage implements ExtractedImage {
  readonly pageIdMin: number;
  readonly pageIdMax: number;
  imageData: Buffer;

  constructor(imageData: Uint8Array, pageIndices: [number, number]) {
    this.pageIdMin = pageIndices[0];
    this.pageIdMax = pageIndices[1];
    this.imageData = Buffer.from(imageData);
  }

  asSource(): BufferInput {
    return new BufferInput({
      buffer: this.imageData,
      filename: `invoice_p_${this.pageIdMin}-${this.pageIdMax}.pdf`,
    });
  }
}
