import {
  Prediction,
  StringDict,
  cleanOutString,
} from "@/v1/parsing/common/index.js";
import { BankAccountDetailsV2Bban } from "./bankAccountDetailsV2Bban.js";
import { StringField } from "@/v1/parsing/standard/index.js";

/**
 * Bank Account Details API version 2.0 document data.
 */
export class BankAccountDetailsV2Document implements Prediction {
  /** Full extraction of the account holders names. */
  accountHoldersNames: StringField;
  /** Full extraction of BBAN, including: branch code, bank code, account and key. */
  bban: BankAccountDetailsV2Bban;
  /** Full extraction of the IBAN number. */
  iban: StringField;
  /** Full extraction of the SWIFT code. */
  swiftCode: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.accountHoldersNames = new StringField({
      prediction: rawPrediction["account_holders_names"],
      pageId: pageId,
    });
    this.bban = new BankAccountDetailsV2Bban({
      prediction: rawPrediction["bban"],
      pageId: pageId,
    });
    this.iban = new StringField({
      prediction: rawPrediction["iban"],
      pageId: pageId,
    });
    this.swiftCode = new StringField({
      prediction: rawPrediction["swift_code"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const outStr = `:Account Holder's Names: ${this.accountHoldersNames}
:Basic Bank Account Number: ${this.bban.toFieldList()}
:IBAN: ${this.iban}
:SWIFT Code: ${this.swiftCode}`.trimEnd();
    return cleanOutString(outStr);
  }
}
