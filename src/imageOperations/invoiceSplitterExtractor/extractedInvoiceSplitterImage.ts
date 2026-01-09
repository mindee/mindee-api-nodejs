import { ExtractedImage } from "@/imageOperations/extractedImage.js";

/**
 * Wrapper class for extracted invoice pages.
 */
export class ExtractedInvoiceSplitterImage extends ExtractedImage {
  readonly pageIdMin: number;
  readonly pageIdMax: number;

  constructor(buffer: Uint8Array, pageIndices: [number, number]) {
    super(buffer, `invoice_p_${pageIndices[0]}-${pageIndices[1]}.pdf`);
    this.pageIdMin = pageIndices[0];
    this.pageIdMax = pageIndices[1];
  }
}
