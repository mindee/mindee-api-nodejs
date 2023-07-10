import { Inference, DocumentConstructorProps } from "../../parsing/common";
import { PositionField } from "../../parsing/standard";

export class CropperV1 extends Inference {
  static endpointName ='cropper';
  static endpointVersion = '1';

  cropping: PositionField[] = [];

  constructor({
    prediction,
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
