import { ExtractedImage } from "@/image/index.js";

export class CropFiles extends Array<ExtractedImage> {
  constructor(...items: ExtractedImage[]) {
    super(...items);
  }
}
