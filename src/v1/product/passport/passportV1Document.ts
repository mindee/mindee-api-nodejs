import {
  Prediction,
  StringDict,
  cleanOutString,
} from "@/v1/parsing/common/index.js";
import { DateField, StringField } from "@/v1/parsing/standard/index.js";

/**
 * Passport API version 1.1 document data.
 */
export class PassportV1Document implements Prediction {
  /** The date of birth of the passport holder. */
  birthDate: DateField;
  /** The place of birth of the passport holder. */
  birthPlace: StringField;
  /** The country's 3 letter code (ISO 3166-1 alpha-3). */
  country: StringField;
  /** The expiry date of the passport. */
  expiryDate: DateField;
  /** The gender of the passport holder. */
  gender: StringField;
  /** The given name(s) of the passport holder. */
  givenNames: StringField[] = [];
  /** The passport's identification number. */
  idNumber: StringField;
  /** The date the passport was issued. */
  issuanceDate: DateField;
  /** Machine Readable Zone, first line */
  mrz1: StringField;
  /** Machine Readable Zone, second line */
  mrz2: StringField;
  /** The surname of the passport holder. */
  surname: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.birthDate = new DateField({
      prediction: rawPrediction["birth_date"],
      pageId: pageId,
    });
    this.birthPlace = new StringField({
      prediction: rawPrediction["birth_place"],
      pageId: pageId,
    });
    this.country = new StringField({
      prediction: rawPrediction["country"],
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
    if (rawPrediction["given_names"]) {
      rawPrediction["given_names"].map(
        (itemPrediction: StringDict) =>
          this.givenNames.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    }
    this.idNumber = new StringField({
      prediction: rawPrediction["id_number"],
      pageId: pageId,
    });
    this.issuanceDate = new DateField({
      prediction: rawPrediction["issuance_date"],
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
    const outStr = `:Country Code: ${this.country}
:ID Number: ${this.idNumber}
:Given Name(s): ${givenNames}
:Surname: ${this.surname}
:Date of Birth: ${this.birthDate}
:Place of Birth: ${this.birthPlace}
:Gender: ${this.gender}
:Date of Issue: ${this.issuanceDate}
:Expiry Date: ${this.expiryDate}
:MRZ Line 1: ${this.mrz1}
:MRZ Line 2: ${this.mrz2}`.trimEnd();
    return cleanOutString(outStr);
  }
}
