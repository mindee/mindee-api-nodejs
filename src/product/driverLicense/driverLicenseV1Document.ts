import {
  Prediction,
  StringDict,
  cleanOutString,
} from "@/parsing/common/index.js";
import { DateField, StringField } from "@/parsing/standard/index.js";

/**
 * Driver License API version 1.0 document data.
 */
export class DriverLicenseV1Document implements Prediction {
  /** The category or class of the driver license. */
  category: StringField;
  /** The alpha-3 ISO 3166 code of the country where the driver license was issued. */
  countryCode: StringField;
  /** The date of birth of the driver license holder. */
  dateOfBirth: DateField;
  /** The DD number of the driver license. */
  ddNumber: StringField;
  /** The expiry date of the driver license. */
  expiryDate: DateField;
  /** The first name of the driver license holder. */
  firstName: StringField;
  /** The unique identifier of the driver license. */
  id: StringField;
  /** The date when the driver license was issued. */
  issuedDate: DateField;
  /** The authority that issued the driver license. */
  issuingAuthority: StringField;
  /** The last name of the driver license holder. */
  lastName: StringField;
  /** The Machine Readable Zone (MRZ) of the driver license. */
  mrz: StringField;
  /** The place of birth of the driver license holder. */
  placeOfBirth: StringField;
  /** Second part of the ISO 3166-2 code, consisting of two letters indicating the US State. */
  state: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
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
    this.ddNumber = new StringField({
      prediction: rawPrediction["dd_number"],
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
    this.id = new StringField({
      prediction: rawPrediction["id"],
      pageId: pageId,
    });
    this.issuedDate = new DateField({
      prediction: rawPrediction["issued_date"],
      pageId: pageId,
    });
    this.issuingAuthority = new StringField({
      prediction: rawPrediction["issuing_authority"],
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
    this.state = new StringField({
      prediction: rawPrediction["state"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const outStr = `:Country Code: ${this.countryCode}
:State: ${this.state}
:ID: ${this.id}
:Category: ${this.category}
:Last Name: ${this.lastName}
:First Name: ${this.firstName}
:Date of Birth: ${this.dateOfBirth}
:Place of Birth: ${this.placeOfBirth}
:Expiry Date: ${this.expiryDate}
:Issued Date: ${this.issuedDate}
:Issuing Authority: ${this.issuingAuthority}
:MRZ: ${this.mrz}
:DD Number: ${this.ddNumber}`.trimEnd();
    return cleanOutString(outStr);
  }
}
