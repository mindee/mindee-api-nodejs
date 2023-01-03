import { Document, DocumentConstructorProps } from "../../document";
import { TextField, DateField } from "../../../fields";

export class CarteVitaleV1 extends Document {
  /** The list of the names of the person. */
  givenNames: TextField[] = [];
  /** The surname of the person. */
  surname: TextField;
  /** The ID number of the card. */
  idNumber: TextField;
  /** The issuance date of the card. */
  issuanceDate: DateField;

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
    this.idNumber = new TextField({
      prediction: prediction.social_security,
      pageId: pageId,
    });
    this.issuanceDate = new DateField({
      prediction: prediction.issuance_date,
      pageId: pageId,
    });
    this.surname = new TextField({
      prediction: prediction.surname,
      pageId: pageId,
    });
    prediction.given_names.map((prediction: { [index: string]: any }) =>
      this.givenNames.push(
        new TextField({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
  }

  toString(): string {
    const outStr = `----- FR Carte Vitale V1 -----
Filename: ${this.filename}
Given names: ${this.givenNames.map((name) => name.value).join(" ")}
Surname: ${this.surname}
ID Number: ${this.idNumber}
Issuance date: ${this.issuanceDate}
----------------------
`;
    return CarteVitaleV1.cleanOutString(outStr);
  }
}
