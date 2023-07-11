import { Document, DocumentConstructorProps } from "../../../parsing/common";
import { TextField } from "../../../parsing/standard";

export class LicensePlateV1 extends Document {
  /** A list of license plates. */
  licensePlates: TextField[] = [];

  constructor({
    prediction,
    orientation = undefined,
    extras = undefined,
    inputSource = undefined,
    pageId = undefined,
  }: DocumentConstructorProps) {
    super({
      inputSource: inputSource,
      pageId: pageId,
      orientation: orientation,
      extras: extras,
    });
    prediction.license_plates.map((prediction: { [index: string]: any }) =>
      this.licensePlates.push(
        new TextField({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
  }

  toString(): string {
    const outStr = `----- EU License Plate V1 -----
Filename: ${this.filename}
License Plates: ${this.licensePlates
      .map((plate) => plate.value)
      .join("\n                ")}
----------------------
`;
    return LicensePlateV1.cleanOutString(outStr);
  }
}
