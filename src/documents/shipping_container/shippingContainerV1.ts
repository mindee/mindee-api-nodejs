import { Document, DocumentConstructorProps } from "../document";
import { TextField } from "../../fields";

export class ShippingContainerV1 extends Document {
  /** ISO 6346 code for container owner prefix + equipment identifier. */
  owner: TextField;
  /** ISO 6346 code for container serial number (6+1 digits). */
  serialNumber: TextField;
  /** ISO 6346 code for container length, height and type. */
  sizeType: TextField;

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
    this.owner = new TextField({
      prediction: prediction.owner,
      pageId: pageId,
    });
    this.serialNumber = new TextField({
      prediction: prediction.serial_number,
      pageId: pageId,
    });
    this.sizeType = new TextField({
      prediction: prediction.size_type,
      pageId: pageId,
    });
  }

  toString(): string {
    const outStr = `----- Shipping Container V1 -----
Filename: ${this.filename}
Owner: ${this.owner}
Serial number: ${this.serialNumber}
Size and type: ${this.sizeType}
----------------------
`;
    return ShippingContainerV1.cleanOutString(outStr);
  }
}
