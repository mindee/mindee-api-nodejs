import { LocalInputSource } from "@/input/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { extractCrops } from "@/v2/fileOperations/crop.js";
import { CropFiles } from "@/v2/fileOperations/cropFiles.js";
import { BaseResponse } from "@/v2/parsing/index.js";
import { CropInference } from "./cropInference.js";

export class CropResponse extends BaseResponse {
  /**
   * Response for a crop utility inference.
   */
  inference: CropInference;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = new CropInference(serverResponse["inference"]);
  }

  /**
   * Extracts all crops from an input.
   * @param inputSource The input file to extract from.
   * @param quality Optional quality parameter for image extraction, default is undefined (full quality).
   */
  async extractFromFile(inputSource: LocalInputSource, quality: number = 1): Promise<CropFiles> {
    return await extractCrops(inputSource, this.inference.result.crops, quality);
  }
}
