import { ExtractedImage } from "@/image/index.js";

/** Collection of extracted image artifacts. */
export class ExtractedImages extends Array<ExtractedImage> {
  constructor(...items: ExtractedImage[]) {
    super(...items);
  }
}
