import { StringDict } from "@/parsing/stringDict.js";
import { CropItem } from "@/v2/parsing/result/crop/cropItem.js";

export class CropResult {
  /**
   * Fields contained in the inference.
   */
  public crop: CropItem[] = [];

  constructor(serverResponse: StringDict) {
    this.crop = serverResponse["crop"].map((cropItem: StringDict) => new CropItem(cropItem));
  }

  toString(): string {
    const crop = this.crop.map(item => item.toString()).join("\n * ");
    return `Crop\n====\n * ${crop}`;
  }
}
