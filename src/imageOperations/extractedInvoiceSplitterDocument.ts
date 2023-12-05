import { ExtractedImage } from "./extractedImage";

export class ExtractedInvoiceSplitterImage extends ExtractedImage {
  readonly pageIdMin: number;
  readonly pageIdMax: number;

  constructor(imageData: Uint8Array, pageIndices: [number, number]) {
    super(imageData, `invoice_p_${pageIndices[0]}-${pageIndices[1]}.pdf`);
    this.pageIdMin = pageIndices[0];
    this.pageIdMax = pageIndices[1];
  }
}
