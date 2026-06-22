import { ExtractedImage } from "@/image/index.js";

export class ExtractedImages extends Array<ExtractedImage> {
  constructor(...items: ExtractedImage[]) {
    super(...items);
  }
}
