import { Document, DocumentConstructorProps } from "../../document";
import { Field } from "../../../fields";

export class LicensePlateV1 extends Document {
  /** A list of license plates values. */
  licensePlates: Field[] = [];

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
        new Field({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
  }

  toString(): string {
    const outStr = `----- EU License plate V1 -----
License plates: ${this.licensePlates.map((plate) => plate.value).join(", ")}
----------------------
`;
    return LicensePlateV1.cleanOutString(outStr);
  }
}
