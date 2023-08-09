import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../../parsing/common";
import { DateField, StringField } from "../../../parsing/standard";

/**
 * Document data for Driver License, API version 1.
 */
export class DriverLicenseV1Document implements Prediction {
  /** US driver license holders address */
  address: StringField;
  /** US driver license holders date of birth */
  dateOfBirth: DateField;
  /** Document Discriminator Number of the US Driver License */
  ddNumber: StringField;
  /** US driver license holders class */
  dlClass: StringField;
  /** ID number of the US Driver License. */
  driverLicenseId: StringField;
  /** US driver license holders endorsements */
  endorsements: StringField;
  /** Date on which the documents expires. */
  expiryDate: DateField;
  /** US driver license holders eye colour */
  eyeColor: StringField;
  /** US driver license holders first name(s) */
  firstName: StringField;
  /** US driver license holders hair colour */
  hairColor: StringField;
  /** US driver license holders hight */
  height: StringField;
  /** Date on which the documents was issued. */
  issuedDate: DateField;
  /** US driver license holders last name */
  lastName: StringField;
  /** US driver license holders restrictions */
  restrictions: StringField;
  /** US driver license holders gender */
  sex: StringField;
  /** US State */
  state: StringField;
  /** US driver license holders weight */
  weight: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.address = new StringField({
      prediction: rawPrediction["address"],
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
    this.dlClass = new StringField({
      prediction: rawPrediction["dl_class"],
      pageId: pageId,
    });
    this.driverLicenseId = new StringField({
      prediction: rawPrediction["driver_license_id"],
      pageId: pageId,
    });
    this.endorsements = new StringField({
      prediction: rawPrediction["endorsements"],
      pageId: pageId,
    });
    this.expiryDate = new DateField({
      prediction: rawPrediction["expiry_date"],
      pageId: pageId,
    });
    this.eyeColor = new StringField({
      prediction: rawPrediction["eye_color"],
      pageId: pageId,
    });
    this.firstName = new StringField({
      prediction: rawPrediction["first_name"],
      pageId: pageId,
    });
    this.hairColor = new StringField({
      prediction: rawPrediction["hair_color"],
      pageId: pageId,
    });
    this.height = new StringField({
      prediction: rawPrediction["height"],
      pageId: pageId,
    });
    this.issuedDate = new DateField({
      prediction: rawPrediction["issued_date"],
      pageId: pageId,
    });
    this.lastName = new StringField({
      prediction: rawPrediction["last_name"],
      pageId: pageId,
    });
    this.restrictions = new StringField({
      prediction: rawPrediction["restrictions"],
      pageId: pageId,
    });
    this.sex = new StringField({
      prediction: rawPrediction["sex"],
      pageId: pageId,
    });
    this.state = new StringField({
      prediction: rawPrediction["state"],
      pageId: pageId,
    });
    this.weight = new StringField({
      prediction: rawPrediction["weight"],
      pageId: pageId,
    });
  }

  toString(): string {
    const outStr = `:State: ${this.state}
:Driver License ID: ${this.driverLicenseId}
:Expiry Date: ${this.expiryDate}
:Date Of Issue: ${this.issuedDate}
:Last Name: ${this.lastName}
:First Name: ${this.firstName}
:Address: ${this.address}
:Date Of Birth: ${this.dateOfBirth}
:Restrictions: ${this.restrictions}
:Endorsements: ${this.endorsements}
:Driver License Class: ${this.dlClass}
:Sex: ${this.sex}
:Height: ${this.height}
:Weight: ${this.weight}
:Hair Color: ${this.hairColor}
:Eye Color: ${this.eyeColor}
:Document Discriminator: ${this.ddNumber}`.trimEnd();
    return cleanOutString(outStr);
  }
}
