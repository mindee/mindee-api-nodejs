import {
  Prediction,
  StringDict,
  cleanOutString,
} from "@/v1/parsing/common/index.js";
import { DateField, StringField } from "@/v1/parsing/standard/index.js";

/**
 * Carte Nationale d'Identité API version 1.1 document data.
 */
export class IdCardV1Document implements Prediction {
  /** The name of the issuing authority. */
  authority: StringField;
  /** The date of birth of the card holder. */
  birthDate: DateField;
  /** The place of birth of the card holder. */
  birthPlace: StringField;
  /** The expiry date of the identification card. */
  expiryDate: DateField;
  /** The gender of the card holder. */
  gender: StringField;
  /** The given name(s) of the card holder. */
  givenNames: StringField[] = [];
  /** The identification card number. */
  idNumber: StringField;
  /** Machine Readable Zone, first line */
  mrz1: StringField;
  /** Machine Readable Zone, second line */
  mrz2: StringField;
  /** The surname of the card holder. */
  surname: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.authority = new StringField({
      prediction: rawPrediction["authority"],
      pageId: pageId,
    });
    this.birthDate = new DateField({
      prediction: rawPrediction["birth_date"],
      pageId: pageId,
    });
    this.birthPlace = new StringField({
      prediction: rawPrediction["birth_place"],
      pageId: pageId,
    });
    this.expiryDate = new DateField({
      prediction: rawPrediction["expiry_date"],
      pageId: pageId,
    });
    this.gender = new StringField({
      prediction: rawPrediction["gender"],
      pageId: pageId,
    });
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
    this.idNumber = new StringField({
      prediction: rawPrediction["id_number"],
      pageId: pageId,
    });
    this.mrz1 = new StringField({
      prediction: rawPrediction["mrz1"],
      pageId: pageId,
    });
    this.mrz2 = new StringField({
      prediction: rawPrediction["mrz2"],
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
    const outStr = `:Identity Number: ${this.idNumber}
:Given Name(s): ${givenNames}
:Surname: ${this.surname}
:Date of Birth: ${this.birthDate}
:Place of Birth: ${this.birthPlace}
:Expiry Date: ${this.expiryDate}
:Issuing Authority: ${this.authority}
:Gender: ${this.gender}
:MRZ Line 1: ${this.mrz1}
:MRZ Line 2: ${this.mrz2}`.trimEnd();
    return cleanOutString(outStr);
  }
}
