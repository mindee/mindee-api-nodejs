import { Inference, DocumentConstructorProps } from "../../../parsing/common";
import { StringField, DateField } from "../../../parsing/standard";

export class CarteVitaleV1 extends Inference {
  endpointName ='carte_vitale';
  endpointVersion = '1';
  /** List of given (first) names of the cardholder. */
  givenNames: StringField[] = [];
  /** The surname of the person. */
  surname: StringField;
  /** The social security number of the cardholder. */
  socialSecurity: StringField;
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
    this.socialSecurity = new StringField({
      prediction: prediction.social_security,
      pageId: pageId,
    });
    this.issuanceDate = new DateField({
      prediction: prediction.issuance_date,
      pageId: pageId,
    });
    this.surname = new StringField({
      prediction: prediction.surname,
      pageId: pageId,
    });
    prediction.given_names.map((prediction: { [index: string]: any }) =>
      this.givenNames.push(
        new StringField({
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
