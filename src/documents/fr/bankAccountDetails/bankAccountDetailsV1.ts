import { Document, DocumentConstructorProps } from "../../document";
import { TextField } from "../../../fields";

export class BankAccountDetailsV1 extends Document {
  /** The IBAN number. */
  iban: TextField;
  /** The account holder name. */
  accountHolderName: TextField;
  /** The SWIFT value. */
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
IBAN: ${this.iban}
Account holder name: ${this.accountHolderName}
SWIFT: ${this.swift}
----------------------
`;
    return BankAccountDetailsV1.cleanOutString(outStr);
  }
}
