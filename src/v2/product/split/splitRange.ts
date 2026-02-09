import { StringDict } from "@/parsing/index.js";

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

  constructor(serverResponse: StringDict) {
    this.pageRange = serverResponse["page_range"];
    this.documentType = serverResponse["document_type"];
  }

  toString(): string {
    const pageRange = this.pageRange.join(",");
    return `* :Page Range: ${pageRange}\n  :Document Type: ${this.documentType}`;
  }
}
