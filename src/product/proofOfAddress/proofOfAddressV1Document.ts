import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../parsing/common";
import {
  CompanyRegistrationField,
  DateField,
  LocaleField,
  StringField,
} from "../../parsing/standard";

/**
 * Document data for Proof of Address, API version 1.
 */
export class ProofOfAddressV1Document implements Prediction {
  /** The date the document was issued. */
  date: DateField;
  /** List of dates found on the document. */
  dates: DateField[] = [];
  /** The address of the document's issuer. */
  issuerAddress: StringField;
  /** List of company registrations found for the issuer. */
  issuerCompanyRegistration: CompanyRegistrationField[] = [];
  /** The name of the person or company issuing the document. */
  issuerName: StringField;
  /** The locale detected on the document. */
  locale: LocaleField;
  /** The address of the recipient. */
  recipientAddress: StringField;
  /** List of company registrations found for the recipient. */
  recipientCompanyRegistration: CompanyRegistrationField[] = [];
  /** The name of the person or company receiving the document. */
  recipientName: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.date = new DateField({
      prediction: rawPrediction["date"],
      pageId: pageId,
    });
    rawPrediction["dates"] &&
      rawPrediction["dates"].map(
        (itemPrediction: StringDict) =>
          this.dates.push(
            new DateField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.issuerAddress = new StringField({
      prediction: rawPrediction["issuer_address"],
      pageId: pageId,
    });
    rawPrediction["issuer_company_registration"] &&
      rawPrediction["issuer_company_registration"].map(
        (itemPrediction: StringDict) =>
          this.issuerCompanyRegistration.push(
            new CompanyRegistrationField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.issuerName = new StringField({
      prediction: rawPrediction["issuer_name"],
      pageId: pageId,
    });
    this.locale = new LocaleField({
      prediction: rawPrediction["locale"],
    });
    this.recipientAddress = new StringField({
      prediction: rawPrediction["recipient_address"],
      pageId: pageId,
    });
    rawPrediction["recipient_company_registration"] &&
      rawPrediction["recipient_company_registration"].map(
        (itemPrediction: StringDict) =>
          this.recipientCompanyRegistration.push(
            new CompanyRegistrationField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.recipientName = new StringField({
      prediction: rawPrediction["recipient_name"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const issuerCompanyRegistration = this.issuerCompanyRegistration.join("\n                              ");
    const recipientCompanyRegistration = this.recipientCompanyRegistration.join("\n                                 ");
    const dates = this.dates.join("\n        ");
    const outStr = `:Locale: ${this.locale}
:Issuer Name: ${this.issuerName}
:Issuer Company Registrations: ${issuerCompanyRegistration}
:Issuer Address: ${this.issuerAddress}
:Recipient Name: ${this.recipientName}
:Recipient Company Registrations: ${recipientCompanyRegistration}
:Recipient Address: ${this.recipientAddress}
:Dates: ${dates}
:Date of Issue: ${this.date}`.trimEnd();
    return cleanOutString(outStr);
  }
}
