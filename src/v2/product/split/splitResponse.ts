import { StringDict } from "@/parsing/stringDict.js";
import { SplitInference } from "./splitInference.js";
import { BaseResponse } from "@/v2/parsing/index.js";
import { LocalInputSource } from "@/input/index.js";
import { expandRange, extractSplits } from "@/v2/fileOperations/split.js";
import { SplitFiles } from "@/v2/fileOperations/splitFiles.js";

export class SplitResponse extends BaseResponse {
  /**
   * Response for an OCR utility inference.
   */
  inference: SplitInference;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = new SplitInference(serverResponse["inference"]);
  }

  /**
   * Extracts all splits from an input PDF.
   * @param inputSource The input file to extract from.
   */
  async extractFromFile(inputSource: LocalInputSource): Promise<SplitFiles>{
    const splits: number[][] = [];
    for (const split of this.inference.result.splits) {
      splits.push(expandRange(split.pageRange as [number, number]));
    }
    return await extractSplits(inputSource, splits);
  }
}
