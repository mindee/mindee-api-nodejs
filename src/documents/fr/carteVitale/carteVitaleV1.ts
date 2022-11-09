import { Document, DocumentConstructorProps } from "../../document";
import { Field, DateField } from "../../../fields";

export class CarteVitaleV1 extends Document {
  /** The list of the names of the person. */
  givenNames: Field[] = [];
  /** The surname of the person. */
  surname: Field;
  /** The id number of the card. */
  idNumber: Field;
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
    this.idNumber = new Field({
      prediction: prediction.social_security,
      pageId: pageId,
    });
    this.issuanceDate = new DateField({
      prediction: prediction.issuance_date,
      pageId: pageId,
    });
    this.surname = new Field({
      prediction: prediction.surname,
      pageId: pageId,
    });
    prediction.given_names.map((prediction: { [index: string]: any }) =>
      this.givenNames.push(
        new Field({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
  }

  toString(): string {
    const outStr = `----- FR Carte Vitale V1 -----
Given names: ${this.givenNames.map((name) => name.value).join(" ")}
Surname: ${this.surname}
ID Number: ${this.idNumber}
Issuance date: ${this.issuanceDate}
----------------------
`;
    return CarteVitaleV1.cleanOutString(outStr);
  }
}
