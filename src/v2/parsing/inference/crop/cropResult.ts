import { StringDict } from "@/parsing/stringDict.js";
import { CropItem } from "@/v2/parsing/inference/crop/cropItem.js";

export class CropResult {
  /**
   * Fields contained in the inference.
   */
  public crop: CropItem[] = [];

  constructor(serverResponse: StringDict) {
    this.crop = serverResponse["crop"].map((cropItem: StringDict) => new CropItem(cropItem));
  }

  toString(): string {
    return `Crop\n====\n${this.crop}`;
  }
}
