import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../parsing/common";
import { StringField } from "../../parsing/standard";

/**
 * Business Card API version 1.0 document data.
 */
export class BusinessCardV1Document implements Prediction {
  /** The address of the person. */
  address: StringField;
  /** The company the person works for. */
  company: StringField;
  /** The email address of the person. */
  email: StringField;
  /** The Fax number of the person. */
  faxNumber: StringField;
  /** The given name of the person. */
  firstname: StringField;
  /** The job title of the person. */
  jobTitle: StringField;
  /** The lastname of the person. */
  lastname: StringField;
  /** The mobile number of the person. */
  mobileNumber: StringField;
  /** The phone number of the person. */
  phoneNumber: StringField;
  /** The social media profiles of the person or company. */
  socialMedia: StringField[] = [];
  /** The website of the person or company. */
  website: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.address = new StringField({
      prediction: rawPrediction["address"],
      pageId: pageId,
    });
    this.company = new StringField({
      prediction: rawPrediction["company"],
      pageId: pageId,
    });
    this.email = new StringField({
      prediction: rawPrediction["email"],
      pageId: pageId,
    });
    this.faxNumber = new StringField({
      prediction: rawPrediction["fax_number"],
      pageId: pageId,
    });
    this.firstname = new StringField({
      prediction: rawPrediction["firstname"],
      pageId: pageId,
    });
    this.jobTitle = new StringField({
      prediction: rawPrediction["job_title"],
      pageId: pageId,
    });
    this.lastname = new StringField({
      prediction: rawPrediction["lastname"],
      pageId: pageId,
    });
    this.mobileNumber = new StringField({
      prediction: rawPrediction["mobile_number"],
      pageId: pageId,
    });
    this.phoneNumber = new StringField({
      prediction: rawPrediction["phone_number"],
      pageId: pageId,
    });
    rawPrediction["social_media"] &&
      rawPrediction["social_media"].map(
        (itemPrediction: StringDict) =>
          this.socialMedia.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.website = new StringField({
      prediction: rawPrediction["website"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const socialMedia = this.socialMedia.join("\n               ");
    const outStr = `:Firstname: ${this.firstname}
:Lastname: ${this.lastname}
:Job Title: ${this.jobTitle}
:Company: ${this.company}
:Email: ${this.email}
:Phone Number: ${this.phoneNumber}
:Mobile Number: ${this.mobileNumber}
:Fax Number: ${this.faxNumber}
:Address: ${this.address}
:Website: ${this.website}
:Social Media: ${socialMedia}`.trimEnd();
    return cleanOutString(outStr);
  }
}
