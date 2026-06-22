import { SplitRange } from "./splitRange.js";
import { StringDict } from "@/parsing/index.js";
import { LocalInputSource } from "@/input/index.js";
import { ExtractedPdfs } from "@/pdf/index.js";
import { extractMultipleSplits, expandRange } from "@/v2/fileOperations/split.js";

/**
 * Split result info.
 */
export class SplitResult {
  /**
   * List of split ranges.
   */
  splits: SplitRange[];

  constructor(rawResponse: StringDict) {
    this.splits = rawResponse.splits.map((split: StringDict) => new SplitRange(split));
  }

  /**
   * Extracts all splits from an input PDF.
   * @param inputSource The input file to extract from.
   */
  async extractFromInputSource(inputSource: LocalInputSource): Promise<ExtractedPdfs>{
    const splits: number[][] = [];
    for (const split of this.splits) {
      splits.push(expandRange(split.pageRange as [number, number]));
    }
    return await extractMultipleSplits(inputSource, splits);
  }

  toString(): string {
    let splits = "\n";
    if (this.splits.length > 0) {
      splits += this.splits.map(split => split.toString()).join("\n\n");
    }
    return `Splits\n======${splits}`;
  }
}
