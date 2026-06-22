import { ExtractedPdf } from "@/pdf/extractedPdf.js";

export class ExtractedPdfs extends Array<ExtractedPdf> {
  constructor(...items: ExtractedPdf[]) {
    super(...items);
  }
}
