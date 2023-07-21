import { Inference, DocumentConstructorProps } from "../../../parsing/common";
import { StringField } from "../../../parsing/standard";
import { BankAccountDetailsV2Bban } from "./bankAccountDetailsV2Bban";

/**
 * Document data for Bank Account Details, API version 2.
 */
export class BankAccountDetailsV2 extends Inference {
  endpointName ='bank_account_details';
  endpointVersion = '2';
  /** Full extraction of the account holders names. */
  accountHoldersNames: StringField;
  /** Full extraction of BBAN, including: branch code, bank code, account and key. */
  bban: BankAccountDetailsV2Bban;
  /** Full extraction of the IBAN number. */
  iban: StringField;
  /** Full extraction of the SWIFT code. */
  swiftCode: StringField;

  constructor({
    prediction,
    orientation = undefined,
    extras = undefined,
    inputSource = undefined,
    fullText = undefined,
    pageId = undefined,
  }: DocumentConstructorProps) {
    super({
      inputSource: inputSource,
      pageId: pageId,
      orientation: orientation,
      extras: extras,
      fullText: fullText,
    });
    this.accountHoldersNames = new StringField({
      prediction: prediction["account_holders_names"],
      pageId: pageId,
    });
    this.bban = new BankAccountDetailsV2Bban({
      prediction: prediction["bban"],
      pageId: pageId,
    });
    this.iban = new StringField({
      prediction: prediction["iban"],
      pageId: pageId,
    });
    this.swiftCode = new StringField({
      prediction: prediction["swift_code"],
      pageId: pageId,
    });
  }

  toString(): string {
    const outStr = `FR Bank Account Details V2 Prediction
=====================================
:Filename: ${this.filename}
:Account Holder's Names: ${this.accountHoldersNames}
:Basic Bank Account Number: ${this.bban.toFieldList()}
:IBAN: ${this.iban}
:SWIFT Code: ${this.swiftCode}
`;
    return BankAccountDetailsV2.cleanOutString(outStr);
  }
}
