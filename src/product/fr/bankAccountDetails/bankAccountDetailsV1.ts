import { Inference, DocumentConstructorProps } from "../../../parsing/common";
import { TextField } from "../../../parsing/standard";

/** French bank account information (RIB) */
export class BankAccountDetailsV1 extends Inference {
  static endpointName ='bank_account_details';
  static endpointVersion = '1';
  /** The account's IBAN. */
  iban: TextField;
  /** The account holder's name. */
  accountHolderName: TextField;
  /** The bank's SWIFT code. */
  swift: TextField;

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
    this.iban = new TextField({
      prediction: prediction.iban,
      pageId: pageId,
    });
    this.accountHolderName = new TextField({
      prediction: prediction.account_holder_name,
      pageId: pageId,
    });
    this.swift = new TextField({
      prediction: prediction.swift,
      pageId: pageId,
    });
  }

  toString(): string {
    const outStr = `----- FR Bank Account Details V1 -----
Filename: ${this.filename}
IBAN: ${this.iban}
Account Holder's Name: ${this.accountHolderName}
SWIFT Code: ${this.swift}
----------------------
`;
    return BankAccountDetailsV1.cleanOutString(outStr);
  }
}
