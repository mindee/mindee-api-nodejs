import { Document, DocumentConstructorProps } from "../document";
import { PositionField } from "../../fields";

export class CropperV1 extends Document {
  cropping: PositionField[] = [];

  constructor({
    prediction,
    orientation = undefined,
    inputSource = undefined,
    pageId = undefined,
  }: DocumentConstructorProps) {
    super({
      inputSource: inputSource,
      pageId: pageId,
      orientation: orientation,
    });
    if (pageId !== undefined) {
      prediction.cropping.forEach((crop: any) => {
        this.cropping.push(
          new PositionField({
            prediction: crop,
            pageId: pageId,
          })
        );
      });
    }
  }

  toString(): string {
    const cropping = this.cropping
      .map((crop) => crop.toString())
      .join("\n          ");
    const outStr = `----- Cropper Data -----
Filename: ${this.filename}
Cropping: ${cropping}
------------------------
`;
    return CropperV1.cleanOutString(outStr);
  }
}
