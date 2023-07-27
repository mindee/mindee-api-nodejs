import {
  cleanOutString,
  Prediction,
  StringDict,
} from "../../../parsing/common";
import { DateField, StringField } from "../../../parsing/standard";

export class IdCardV1Document implements Prediction {
  /** The authority which has issued the card. */
  authority: StringField;
  /** The id number of the card. */
  idNumber: StringField;
  /** The birth date of the person. */
  birthDate: DateField;
  /** The expiry date of the card. */
  expiryDate: DateField;
  /** The birth place of the person. */
  birthPlace: StringField;
  /** The gender of the person. */
  gender: StringField;
  /** The first mrz value. */
  mrz1: StringField;
  /** The second mrz value. */
  mrz2: StringField;
  /** The surname of the person. */
  surname: StringField;
  /** The list of the names of the person. */
  givenNames: StringField[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.authority = new StringField({
      prediction: rawPrediction["authority"],
      pageId: pageId,
    });
    this.idNumber = new StringField({
      prediction: rawPrediction["id_number"],
      pageId: pageId,
    });
    this.birthDate = new DateField({
      prediction: rawPrediction["birth_date"],
      pageId: pageId,
    });
    this.expiryDate = new DateField({
      prediction: rawPrediction["expiry_date"],
      pageId: pageId,
    });
    this.birthPlace = new StringField({
      prediction: rawPrediction["birth_place"],
      pageId: pageId,
    });
    this.gender = new StringField({
      prediction: rawPrediction["gender"],
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
    rawPrediction["given_names"] &&
      rawPrediction["given_names"].forEach((prediction: StringDict) => {
        this.givenNames.push(
          new StringField({
            prediction: prediction,
            pageId: pageId,
          })
        );
      });
  }

  toString(): string {
    const givenNames = this.givenNames
      .map((item: StringField) => item.toString())
      .join(", ");
    const outStr: string = `:Identity Number: ${this.idNumber}
:Given Name(s): ${givenNames}
:Surname: ${this.surname}
:Date of Birth: ${this.birthDate}
:Place of Birth: ${this.birthPlace}
:Expiry Date: ${this.expiryDate}
:Issuing Authority: ${this.authority}
:Gender: ${this.gender}
:MRZ Line 1: ${this.mrz1}
:MRZ Line 2: ${this.mrz2}`;
    return cleanOutString(outStr);
  }
}
