import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../../parsing/common";
import { DateField, StringField } from "../../../parsing/standard";

/**
 * Carte Vitale API version 1.1 document data.
 */
export class CarteVitaleV1Document implements Prediction {
  /** The given name(s) of the card holder. */
  givenNames: StringField[] = [];
  /** The date the card was issued. */
  issuanceDate: DateField;
  /** The Social Security Number (Numéro de Sécurité Sociale) of the card holder */
  socialSecurity: StringField;
  /** The surname of the card holder. */
  surname: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    rawPrediction["given_names"] &&
      rawPrediction["given_names"].map(
        (itemPrediction: StringDict) =>
          this.givenNames.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.issuanceDate = new DateField({
      prediction: rawPrediction["issuance_date"],
      pageId: pageId,
    });
    this.socialSecurity = new StringField({
      prediction: rawPrediction["social_security"],
      pageId: pageId,
    });
    this.surname = new StringField({
      prediction: rawPrediction["surname"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const givenNames = this.givenNames.join("\n                ");
    const outStr = `:Given Name(s): ${givenNames}
:Surname: ${this.surname}
:Social Security Number: ${this.socialSecurity}
:Issuance Date: ${this.issuanceDate}`.trimEnd();
    return cleanOutString(outStr);
  }
}
