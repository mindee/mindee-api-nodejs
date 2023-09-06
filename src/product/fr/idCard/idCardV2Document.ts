import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../../parsing/common";
import { DateField, StringField } from "../../../parsing/standard";

/**
 * Document data for Carte Nationale d'Identité, API version 2.
 */
export class IdCardV2Document implements Prediction {
  /** The alternate name of the card holder. */
  alternateName: StringField;
  /** The name of the issuing authority. */
  authority: StringField;
  /** The date of birth of the card holder. */
  birthDate: DateField;
  /** The place of birth of the card holder. */
  birthPlace: StringField;
  /** The card access number (CAN). */
  cardAccessNumber: StringField;
  /** The document number. */
  documentNumber: StringField;
  /** The expiry date of the identification card. */
  expiryDate: DateField;
  /** The gender of the card holder. */
  gender: StringField;
  /** The given name(s) of the card holder. */
  givenNames: StringField[] = [];
  /** The date of issue of the identification card. */
  issueDate: DateField;
  /** The Machine Readable Zone, first line. */
  mrz1: StringField;
  /** The Machine Readable Zone, second line. */
  mrz2: StringField;
  /** The Machine Readable Zone, third line. */
  mrz3: StringField;
  /** The nationality of the card holder. */
  nationality: StringField;
  /** The surname of the card holder. */
  surname: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.alternateName = new StringField({
      prediction: rawPrediction["alternate_name"],
      pageId: pageId,
    });
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
    this.cardAccessNumber = new StringField({
      prediction: rawPrediction["card_access_number"],
      pageId: pageId,
    });
    this.documentNumber = new StringField({
      prediction: rawPrediction["document_number"],
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
    this.issueDate = new DateField({
      prediction: rawPrediction["issue_date"],
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
    this.mrz3 = new StringField({
      prediction: rawPrediction["mrz3"],
      pageId: pageId,
    });
    this.nationality = new StringField({
      prediction: rawPrediction["nationality"],
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
    let outStr = `:Nationality: ${this.nationality}
:Card Access Number: ${this.cardAccessNumber}
:Document Number: ${this.documentNumber}
:Given Name(s): ${givenNames}
:Surname: ${this.surname}
:Alternate Name: ${this.alternateName}
:Date of Birth: ${this.birthDate}
:Place of Birth: ${this.birthPlace}
:Gender: ${this.gender}
:Expiry Date: ${this.expiryDate}
:Mrz Line 1: ${this.mrz1}
:Mrz Line 2: ${this.mrz2}
:Mrz Line 3: ${this.mrz3}
:Date of Issue: ${this.issueDate}
:Issuing Authority: ${this.authority}`;
    outStr = outStr.trimEnd();
    return cleanOutString(outStr);
  }
}
