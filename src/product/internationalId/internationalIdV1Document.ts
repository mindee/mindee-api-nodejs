import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../parsing/common";
import {
  ClassificationField,
  DateField,
  StringField,
} from "../../parsing/standard";

/**
 * Document data for International ID, API version 1.
 */
export class InternationalIdV1Document implements Prediction {
  /** The physical location of the document holder's residence. */
  address: StringField;
  /** The date of birth of the document holder. */
  birthDate: DateField;
  /** The location where the document holder was born. */
  birthPlace: StringField;
  /** The country that issued the identification document. */
  countryOfIssue: StringField;
  /** The unique identifier assigned to the identification document. */
  documentNumber: StringField;
  /** The type of identification document being used. */
  documentType: ClassificationField;
  /** The date when the document will no longer be valid for use. */
  expiryDate: DateField;
  /** The first names or given names of the document holder. */
  givenNames: StringField[] = [];
  /** The date when the document was issued. */
  issueDate: DateField;
  /** First line of information in a standardized format for easy machine reading and processing. */
  mrz1: StringField;
  /** Second line of information in a standardized format for easy machine reading and processing. */
  mrz2: StringField;
  /** Third line of information in a standardized format for easy machine reading and processing. */
  mrz3: StringField;
  /** Indicates the country of citizenship or nationality of the document holder. */
  nationality: StringField;
  /** The document holder's biological sex, such as male or female. */
  sex: StringField;
  /** The surnames of the document holder. */
  surnames: StringField[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.address = new StringField({
      prediction: rawPrediction["address"],
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
    this.countryOfIssue = new StringField({
      prediction: rawPrediction["country_of_issue"],
      pageId: pageId,
    });
    this.documentNumber = new StringField({
      prediction: rawPrediction["document_number"],
      pageId: pageId,
    });
    this.documentType = new ClassificationField({
      prediction: rawPrediction["document_type"],
    });
    this.expiryDate = new DateField({
      prediction: rawPrediction["expiry_date"],
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
    this.sex = new StringField({
      prediction: rawPrediction["sex"],
      pageId: pageId,
    });
    rawPrediction["surnames"] &&
      rawPrediction["surnames"].map(
        (itemPrediction: StringDict) =>
          this.surnames.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const surnames = this.surnames.join("\n           ");
    const givenNames = this.givenNames.join("\n              ");
    const outStr = `:Document Type: ${this.documentType}
:Document Number: ${this.documentNumber}
:Country of Issue: ${this.countryOfIssue}
:Surnames: ${surnames}
:Given Names: ${givenNames}
:Gender: ${this.sex}
:Birth date: ${this.birthDate}
:Birth Place: ${this.birthPlace}
:Nationality: ${this.nationality}
:Issue Date: ${this.issueDate}
:Expiry Date: ${this.expiryDate}
:Address: ${this.address}
:Machine Readable Zone Line 1: ${this.mrz1}
:Machine Readable Zone Line 2: ${this.mrz2}
:Machine Readable Zone Line 3: ${this.mrz3}`.trimEnd();
    return cleanOutString(outStr);
  }
}
