import { BufferInput } from "../input";
import { ExtractedImage } from "./extractedImage";

export class ExtractedInvoiceSplitterImage extends ExtractedImage {
  readonly pageIdMin: number;
  readonly pageIdMax: number;

  constructor(imageData: Uint8Array, pageIndices: [number, number]) {
    super(imageData);
    this.pageIdMin = pageIndices[0];
    this.pageIdMax = pageIndices[1];
  }

  asSource(): BufferInput {
    return new BufferInput({
      buffer: this.imageData,
      filename: `invoice_p_${this.pageIdMin}-${this.pageIdMax}.pdf`,
    });
  }
}
