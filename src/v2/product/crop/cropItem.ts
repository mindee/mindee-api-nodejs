import { FieldLocation } from "@/v2/parsing/inference/field/index.js";
import { StringDict } from "@/parsing/index.js";
import { LocalInputSource } from "@/input/index.js";
import { extractCrops } from "@/v2/fileOperations/crop.js";
import { ExtractedImage } from "@/image/index.js";

export class CropItem {
  objectType: string;
  location: FieldLocation;

  constructor(serverResponse: StringDict) {
    this.objectType = serverResponse["object_type"];
    this.location = new FieldLocation(serverResponse["location"]);
  }

  toString(): string {
    return `* :Location: ${this.location}\n  :Object Type: ${this.objectType}`;
  }

  /**
   * Extracts a single crop from an input.
   * @param inputSource The input file to extract from.
   * @param quality Optional quality parameter for image extraction, default is undefined (full quality).
   */
  async extractFromFile(inputSource: LocalInputSource, quality: number = 1): Promise<ExtractedImage>{
    return (await extractCrops(inputSource, [this], quality))[0];
  }
}
