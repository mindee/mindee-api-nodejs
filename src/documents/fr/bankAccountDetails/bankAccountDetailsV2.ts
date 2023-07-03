import { Document, DocumentConstructorProps } from "../../document";
import { TextField } from "../../../fields";
import { BankAccountDetailsV2Bban } from "./bankAccountDetailsV2Bban";

/**
 * Document data for Bank Account Details, API version 2.
 */
export class BankAccountDetailsV2 extends Document {
  /** Full extraction of the account holders names. */
  accountHoldersNames: TextField;
  /** Full extraction of BBAN, including: branch code, bank code, account and key. */
  bban: BankAccountDetailsV2Bban;
  /** Full extraction of the IBAN number. */
  iban: TextField;
  /** Full extraction of the SWIFT code. */
  swiftCode: TextField;

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
    this.accountHoldersNames = new TextField({
      prediction: prediction["account_holders_names"],
      pageId: pageId,
    });
    this.bban = new BankAccountDetailsV2Bban({
      prediction: prediction["bban"],
      pageId: pageId,
    });
    this.iban = new TextField({
      prediction: prediction["iban"],
      pageId: pageId,
    });
    this.swiftCode = new TextField({
      prediction: prediction["swift_code"],
      pageId: pageId,
    });
  }

  toString(): string {
    const outStr = `FR Bank Account Details V2 Prediction
=====================================
:Filename: ${this.filename}
:Account Holder's Names: ${this.accountHoldersNames}
:Basic Bank Account Number: ${this.#bbanToString()}
:IBAN: ${this.iban}
:SWIFT Code: ${this.swiftCode}
`;
    return BankAccountDetailsV2.cleanOutString(outStr);
  }

  #bbanToString() {
    return this.bban.toFieldList();
  }
}
