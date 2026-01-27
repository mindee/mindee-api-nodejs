import { StringDict, cleanOutString } from "@/v1/parsing/common/index.js";
import { PositionField } from "@/v1/parsing/standard/index.js";

import { CropperV1Document } from "./cropperV1Document.js";

/**
 * Cropper API version 1.1 page data.
 */
export class CropperV1Page extends CropperV1Document {
  /** List of documents found in the image. */
  cropping: PositionField[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    super();

    rawPrediction["cropping"].map(
      (itemPrediction: StringDict) =>
        this.cropping.push(
          new PositionField({
            prediction: itemPrediction,
            pageId: pageId,
          })
        )
    );
  }

  toString(): string {
    const cropping = this.cropping.join("\n                   ");
    const outStr = `:Document Cropper: ${cropping}`.trimEnd();
    return cleanOutString(outStr);
  }
}
