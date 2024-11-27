import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../../parsing/common";
import { DateField, StringField } from "../../../parsing/standard";

/**
 * Health Card API version 1.0 document data.
 */
export class HealthCardV1Document implements Prediction {
  /** The given names of the card holder. */
  givenNames: StringField[] = [];
  /** The date when the carte vitale document was issued. */
  issuanceDate: DateField;
  /** The social security number of the card holder. */
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
