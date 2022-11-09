import { Document, DocumentConstructorProps } from "../../document";
import { Field } from "../../../fields";

export class BankAccountDetailsV1 extends Document {
  /** The IBAN number. */
  iban: Field;
  /** The account holder name. */
  accountHolderName: Field;
  /** The SWIFT value. */
  swift: Field;

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
    this.iban = new Field({
      prediction: prediction.iban,
      pageId: pageId,
    });
    this.accountHolderName = new Field({
      prediction: prediction.account_holder_name,
      pageId: pageId,
    });
    this.swift = new Field({
      prediction: prediction.swift,
      pageId: pageId,
    });
  }

  toString(): string {
    const outStr = `----- FR Bank Account Details V1 -----
IBAN: ${this.iban}
Account holder name: ${this.accountHolderName}
Swift: ${this.swift}
----------------------
`;
    return BankAccountDetailsV1.cleanOutString(outStr);
  }
}
