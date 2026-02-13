import { SplitRange } from "./splitRange.js";
import { StringDict } from "@/parsing/index.js";

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

  toString(): string {
    let splits = "\n";
    if (this.splits.length > 0) {
      splits += this.splits.map(split => split.toString()).join("\n\n");
    }
    return `Splits\n======${splits}`;
  }
}
