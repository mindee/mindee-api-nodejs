import { ExtractedPdf } from "@/pdf/index.js";

/**
 * Wrapper class for extracted invoice pages.
 */
export class ExtractedInvoiceSplitterImage extends ExtractedPdf {
  readonly pageIdMin: number;
  readonly pageIdMax: number;

  constructor(bytes: Uint8Array, pageIndices: [number, number]) {
    super(Buffer.from(bytes), `invoice_p_${pageIndices[0]}-${pageIndices[1]}.pdf`, pageIndices);
    this.pageIdMin = pageIndices[0];
    this.pageIdMax = pageIndices[1];
  }
}
