import { ExtractedPdf } from "@/pdf/extractedPdf.js";

/** Collection of extracted PDF artifacts. */
export class ExtractedPdfs extends Array<ExtractedPdf> {
  constructor(...items: ExtractedPdf[]) {
    super(...items);
  }
}
