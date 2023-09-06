import { StringDict, cleanOutString } from "../../parsing/common";
import { PositionField } from "../../parsing/standard";

import { CropperV1Document } from "./cropperV1Document";

/**
 * Page data for Cropper, API version 1.
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
