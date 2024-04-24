import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../../parsing/common";
import { DateField, StringField } from "../../../parsing/standard";

/**
 * Driver License API version 1.0 document data.
 */
export class DriverLicenseV1Document implements Prediction {
  /** EU driver license holders address */
  address: StringField;
  /** EU driver license holders categories */
  category: StringField;
  /** Country code extracted as a string. */
  countryCode: StringField;
  /** The date of birth of the document holder */
  dateOfBirth: DateField;
  /** ID number of the Document. */
  documentId: StringField;
  /** Date the document expires */
  expiryDate: DateField;
  /** First name(s) of the driver license holder */
  firstName: StringField;
  /** Authority that issued the document */
  issueAuthority: StringField;
  /** Date the document was issued */
  issueDate: DateField;
  /** Last name of the driver license holder. */
  lastName: StringField;
  /** Machine-readable license number */
  mrz: StringField;
  /** Place where the driver license holder was born */
  placeOfBirth: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.address = new StringField({
      prediction: rawPrediction["address"],
      pageId: pageId,
    });
    this.category = new StringField({
      prediction: rawPrediction["category"],
      pageId: pageId,
    });
    this.countryCode = new StringField({
      prediction: rawPrediction["country_code"],
      pageId: pageId,
    });
    this.dateOfBirth = new DateField({
      prediction: rawPrediction["date_of_birth"],
      pageId: pageId,
    });
    this.documentId = new StringField({
      prediction: rawPrediction["document_id"],
      pageId: pageId,
    });
    this.expiryDate = new DateField({
      prediction: rawPrediction["expiry_date"],
      pageId: pageId,
    });
    this.firstName = new StringField({
      prediction: rawPrediction["first_name"],
      pageId: pageId,
    });
    this.issueAuthority = new StringField({
      prediction: rawPrediction["issue_authority"],
      pageId: pageId,
    });
    this.issueDate = new DateField({
      prediction: rawPrediction["issue_date"],
      pageId: pageId,
    });
    this.lastName = new StringField({
      prediction: rawPrediction["last_name"],
      pageId: pageId,
    });
    this.mrz = new StringField({
      prediction: rawPrediction["mrz"],
      pageId: pageId,
    });
    this.placeOfBirth = new StringField({
      prediction: rawPrediction["place_of_birth"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const outStr = `:Country Code: ${this.countryCode}
:Document ID: ${this.documentId}
:Driver License Category: ${this.category}
:Last Name: ${this.lastName}
:First Name: ${this.firstName}
:Date Of Birth: ${this.dateOfBirth}
:Place Of Birth: ${this.placeOfBirth}
:Expiry Date: ${this.expiryDate}
:Issue Date: ${this.issueDate}
:Issue Authority: ${this.issueAuthority}
:MRZ: ${this.mrz}
:Address: ${this.address}`.trimEnd();
    return cleanOutString(outStr);
  }
}
