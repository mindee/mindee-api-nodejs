import { StringDict } from "@/parsing/stringDict.js";
import { CropItem } from "@/v2/product/crop/cropItem.js";
import { LocalInputSource } from "@/input/index.js";
import { extractMultipleCrops } from "@/v2/fileOperations/crop.js";
import { ExtractedImages } from "@/image/extractedImages.js";

export class CropResult {
  /**
   * Fields contained in the inference.
   */
  public crops: CropItem[] = [];

  constructor(serverResponse: StringDict) {
    this.crops = serverResponse["crops"].map((cropItem: StringDict) => new CropItem(cropItem));
  }

  toString(): string {
    const crops = this.crops.map(item => item.toString()).join("\n");
    return `Crops\n=====\n${crops}`;
  }

  /**
   * Extracts a single crop from an input.
   * @param inputSource The input file to extract from.
   * @param quality Optional quality parameter for image extraction, default is undefined (full quality).
   */
  async extractFromInputSource(inputSource: LocalInputSource, quality: number = 1): Promise<ExtractedImages>{
    return (await extractMultipleCrops(inputSource, this.crops, quality));
  }
}
