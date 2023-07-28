import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../../parsing/common";
import { StringField } from "../../../parsing/standard";

/**
 * Document data for Bank Account Details, API version 1.
 */
export class BankAccountDetailsV1Document implements Prediction {
  /** The name of the account holder as seen on the document. */
  accountHolderName: StringField;
  /** The International Bank Account Number (IBAN). */
  iban: StringField;
  /** The bank's SWIFT Business Identifier Code (BIC). */
  swift: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.accountHolderName = new StringField({
      prediction: rawPrediction["account_holder_name"],
      pageId: pageId,
    });
    this.iban = new StringField({
      prediction: rawPrediction["iban"],
      pageId: pageId,
    });
    this.swift = new StringField({
      prediction: rawPrediction["swift"],
      pageId: pageId,
    });
  }

  toString(): string {
    const outStr = `:IBAN: ${this.iban}
:Account Holder's Name: ${this.accountHolderName}
:SWIFT Code: ${this.swift}`.trimEnd();
    return cleanOutString(outStr);
  }
}
