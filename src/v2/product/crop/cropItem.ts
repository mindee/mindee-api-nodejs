import { FieldLocation } from "@/v2/parsing/inference/field/index.js";
import { StringDict } from "@/parsing/index.js";
import { LocalInputSource } from "@/input/index.js";
import { extractSingleCrop } from "@/v2/fileOperations/crop.js";
import { ExtractedImage } from "@/image/index.js";
import { ExtractionResponse } from "@/v2/product/index.js";

export class CropItem {
  /**
   * Type or classification of the detected object.
   */
  objectType: string;
  /**
   * Location that includes cropping coordinates for the detected object, within the source document.
   */
  location: FieldLocation;
  /**
   * The extraction response associated with the crop.
   */
  extractionResponse?: ExtractionResponse;

  constructor(serverResponse: StringDict) {
    this.objectType = serverResponse["object_type"];
    this.location = new FieldLocation(serverResponse["location"]);
    this.extractionResponse = serverResponse["extraction_response"]
      ? new ExtractionResponse(serverResponse["extraction_response"])
      : undefined;
  }

  toString(): string {
    return `* :Location: ${this.location}\n  :Object Type: ${this.objectType}`;
  }

  /**
   * Extracts a single crop from an input.
   * @param inputSource The input file to extract from.
   * @param quality Optional quality parameter for image extraction, default is undefined (full quality).
   */
  async extractFromInputSource(inputSource: LocalInputSource, quality: number = 1): Promise<ExtractedImage>{
    return (await extractSingleCrop(inputSource, this, quality));
  }
}
