import { StringDict } from "@/parsing/stringDict.js";
import { CropItem } from "@/v2/parsing/result/crop/cropItem.js";

export class CropResult {
  /**
   * Fields contained in the inference.
   */
  public crops: CropItem[] = [];

  constructor(serverResponse: StringDict) {
    this.crops = serverResponse["crops"].map((cropItem: StringDict) => new CropItem(cropItem));
  }

  toString(): string {
    const crops = this.crops.map(item => item.toString()).join("\n * ");
    return `Crop\n====\n * ${crops}`;
  }
}
