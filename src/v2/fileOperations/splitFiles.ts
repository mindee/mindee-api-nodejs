import { ExtractedPdf } from "@/pdf/extractedPdf.js";

export class SplitFiles extends Array<ExtractedPdf> {

  constructor(...args: ExtractedPdf[]) {
    super(...args);
  }
}
