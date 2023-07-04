import { Document, DocumentConstructorProps } from "../../parsing/common";
import {
  CompanyRegistration,
  DateField,
  Locale,
  TextField,
} from "../../parsing/standard";

export class ProofOfAddressV1 extends Document {
  /** ISO date yyyy-mm-dd. Works both for European and US dates. */
  date: DateField;
  /** All extrated ISO date yyyy-mm-dd. Works both for European and US dates. */
  dates: DateField[] = [];
  /** Address of the document's issuer. */
  issuerAddress: TextField;
  /** Generic: VAT NUMBER, TAX ID, COMPANY REGISTRATION NUMBER or country specific. */
  issuerCompanyRegistration: CompanyRegistration[] = [];
  /** Name of the person or company issuing the document. */
  issuerName: TextField;
  /** ISO 639-1 code, works best with ca, de, en, es, fr, it, nl and pt. */
  locale: Locale;
  /** Address of supplier. */
  recipientAddress: TextField;
  /** Generic: VAT NUMBER, TAX ID, COMPANY REGISTRATION NUMBER or country specific. */
  recipientCompanyRegistration: CompanyRegistration[] = [];
  /** Name of the document's recipient. */
  recipientName: TextField;

  constructor({
    prediction,
    orientation = undefined,
    extras = undefined,
    inputSource = undefined,
    pageId = undefined,
  }: DocumentConstructorProps) {
    super({
      inputSource: inputSource,
      pageId: pageId,
      orientation: orientation,
      extras: extras,
    });
    this.locale = new Locale({
      prediction: prediction.locale,
    });
    this.date = new DateField({
      prediction: prediction.date,
      pageId: pageId,
    });
    prediction.dates.map((prediction: { [index: string]: any }) =>
      this.dates.push(
        new DateField({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
    this.issuerAddress = new TextField({
      prediction: prediction.issuer_address,
      pageId: pageId,
    });
    prediction.issuer_company_registration.map(
      (prediction: { [index: string]: any }) =>
        this.issuerCompanyRegistration.push(
          new CompanyRegistration({
            prediction: prediction,
            pageId: pageId,
          })
        )
    );
    this.issuerName = new TextField({
      prediction: prediction.issuer_name,
      pageId: pageId,
    });
    prediction.recipient_company_registration.map(
      (prediction: { [index: string]: any }) =>
        this.recipientCompanyRegistration.push(
          new CompanyRegistration({
            prediction: prediction,
            pageId: pageId,
          })
        )
    );
    this.recipientAddress = new TextField({
      prediction: prediction.recipient_address,
      pageId: pageId,
    });
    this.recipientName = new TextField({
      prediction: prediction.recipient_name,
      pageId: pageId,
    });
  }

  toString(): string {
    const outStr = `----- Proof of Address V1 -----
Filename: ${this.filename}
Locale: ${this.locale}
Issuer Name: ${this.issuerName}
Issuer Company Registrations: ${this.issuerCompanyRegistration
      .map((icr) => icr.value)
      .join(", ")}
Issuer Address: ${this.issuerAddress}
Recipient Name: ${this.recipientName}
Recipient Company Registrations: ${this.recipientCompanyRegistration
      .map((rcr) => rcr.value)
      .join(", ")}
Recipient Address: ${this.recipientAddress}
Dates: ${this.dates.map((rcr) => rcr.value).join("\n       ")}
Date of Issue: ${this.date}
----------------------
`;
    return ProofOfAddressV1.cleanOutString(outStr);
  }
}
