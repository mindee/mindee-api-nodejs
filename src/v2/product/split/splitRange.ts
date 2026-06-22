import { StringDict } from "@/parsing/index.js";
import { LocalInputSource } from "@/input/index.js";
import { expandRange, extractMultipleSplits } from "@/v2/fileOperations/split.js";
import { ExtractionResponse } from "@/v2/product/index.js";
import { ExtractedPdf } from "@/pdf/index.js";

/**
 * Split inference result.
 */
export class SplitRange {
  /**
   * 0-based page indexes, where the first integer indicates the start page and the
   * second integer indicates the end page.
   */
  pageRange: number[];
  /**
   * The document type, as identified on given classification values.
   */
  documentType: string;
  /**
   * The extraction response associated with the split.
   */
  extractionResponse?: ExtractionResponse;

  constructor(serverResponse: StringDict) {
    this.pageRange = serverResponse["page_range"];
    this.documentType = serverResponse["document_type"];
    this.extractionResponse = serverResponse["extraction_response"]
      ? new ExtractionResponse(serverResponse["extraction_response"])
      : undefined;
  }

  toString(): string {
    const pageRange = this.pageRange.join(",");
    return `* :Page Range: ${pageRange}\n  :Document Type: ${this.documentType}`;
  }

  /**
   * Extracts a single split from the input file.
   * @param inputSource The input file to extract from.
   */
  async extractFromFile(inputSource: LocalInputSource): Promise<ExtractedPdf> {
    const pageRange = [expandRange(this.pageRange as [number, number])];
    return (await extractMultipleSplits(inputSource, pageRange))[0];
  }
}
