import {
  Prediction,
  StringDict,
  cleanOutString,
} from "@/parsing/common/index.js";
import {
  ClassificationField,
  DateField,
  StringField,
} from "@/parsing/standard/index.js";

/**
 * International ID API version 2.2 document data.
 */
export class InternationalIdV2Document implements Prediction {
  /** The physical address of the document holder. */
  address: StringField;
  /** The date of birth of the document holder. */
  birthDate: DateField;
  /** The place of birth of the document holder. */
  birthPlace: StringField;
  /** The country where the document was issued. */
  countryOfIssue: StringField;
  /** The unique identifier assigned to the document. */
  documentNumber: StringField;
  /** The type of personal identification document. */
  documentType: ClassificationField;
  /** The date when the document becomes invalid. */
  expiryDate: DateField;
  /** The list of the document holder's given names. */
  givenNames: StringField[] = [];
  /** The date when the document was issued. */
  issueDate: DateField;
  /** The Machine Readable Zone, first line. */
  mrzLine1: StringField;
  /** The Machine Readable Zone, second line. */
  mrzLine2: StringField;
  /** The Machine Readable Zone, third line. */
  mrzLine3: StringField;
  /** The country of citizenship of the document holder. */
  nationality: StringField;
  /** The unique identifier assigned to the document holder. */
  personalNumber: StringField;
  /** The biological sex of the document holder. */
  sex: StringField;
  /** The state or territory where the document was issued. */
  stateOfIssue: StringField;
  /** The list of the document holder's family names. */
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
    this.mrzLine1 = new StringField({
      prediction: rawPrediction["mrz_line1"],
      pageId: pageId,
    });
    this.mrzLine2 = new StringField({
      prediction: rawPrediction["mrz_line2"],
      pageId: pageId,
    });
    this.mrzLine3 = new StringField({
      prediction: rawPrediction["mrz_line3"],
      pageId: pageId,
    });
    this.nationality = new StringField({
      prediction: rawPrediction["nationality"],
      pageId: pageId,
    });
    this.personalNumber = new StringField({
      prediction: rawPrediction["personal_number"],
      pageId: pageId,
    });
    this.sex = new StringField({
      prediction: rawPrediction["sex"],
      pageId: pageId,
    });
    this.stateOfIssue = new StringField({
      prediction: rawPrediction["state_of_issue"],
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
:Surnames: ${surnames}
:Given Names: ${givenNames}
:Sex: ${this.sex}
:Birth Date: ${this.birthDate}
:Birth Place: ${this.birthPlace}
:Nationality: ${this.nationality}
:Personal Number: ${this.personalNumber}
:Country of Issue: ${this.countryOfIssue}
:State of Issue: ${this.stateOfIssue}
:Issue Date: ${this.issueDate}
:Expiration Date: ${this.expiryDate}
:Address: ${this.address}
:MRZ Line 1: ${this.mrzLine1}
:MRZ Line 2: ${this.mrzLine2}
:MRZ Line 3: ${this.mrzLine3}`.trimEnd();
    return cleanOutString(outStr);
  }
}
