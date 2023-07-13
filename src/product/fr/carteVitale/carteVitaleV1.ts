import { Inference, DocumentConstructorProps } from "../../../parsing/common";
import { TextField, DateField } from "../../../parsing/standard";

export class CarteVitaleV1 extends Inference {
  endpointName ='carte_vitale';
  endpointVersion = '1';
  /** List of given (first) names of the cardholder. */
  givenNames: TextField[] = [];
  /** The surname of the person. */
  surname: TextField;
  /** The social security number of the cardholder. */
  socialSecurity: TextField;
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
    this.socialSecurity = new TextField({
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
Given Name(s): ${this.givenNames.map((name) => name.value).join(" ")}
Surname: ${this.surname}
Social Security Number: ${this.socialSecurity}
Issuance Date: ${this.issuanceDate}
----------------------
`;
    return CarteVitaleV1.cleanOutString(outStr);
  }
}
