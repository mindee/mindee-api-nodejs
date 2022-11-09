import { Document, DocumentConstructorProps } from "../../document";
import { Field, DateField, PositionField, Amount } from "../../../fields";

export class BankCheckV1 extends Document {
  /** Payer's bank account number. */
  accountNumber: Field;
  /** Total including taxes. */
  amount: Amount;
  /** Payer's bank account number. */
  checkNumber: Field;
  /** Check's position in the image. */
  checkPosition: PositionField;
  /** Date the check was issued. */
  issuanceDate: DateField;
  /** List of payees (full name or company name). */
  payees: Field[] = [];
  /** Payer's bank account routing number. */
  routingNumber: Field;
  /** Signatures' positions in the image. */
  signaturesPositions: PositionField;

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
    this.accountNumber = new Field({
      prediction: prediction.account_number,
      pageId: pageId,
    });
    this.checkNumber = new Field({
      prediction: prediction.check_number,
      pageId: pageId,
    });
    this.amount = new Amount({
      prediction: prediction.amount,
      valueKey: "value",
      pageId: pageId,
    });
    this.checkPosition = new PositionField({
      prediction: prediction.check_position,
      pageId: pageId,
    });
    this.issuanceDate = new DateField({
      prediction: prediction.date,
      pageId: pageId,
    });
    prediction.payees.map((prediction: { [index: string]: any }) =>
      this.payees.push(
        new Field({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
    this.routingNumber = new Field({
      prediction: prediction.routing_number,
      pageId: pageId,
    });
    this.signaturesPositions = new PositionField({
      prediction: prediction.signatures_positions,
      pageId: pageId,
    });
  }

  toString(): string {
    const outStr = `----- US Bank Check V1 -----
Filename: ${this.filename}
Routing number: ${this.routingNumber}
Account number: ${this.accountNumber}
Check number: ${this.checkNumber}
Date: ${this.issuanceDate}
Amount: ${this.amount}
Payees: ${this.payees.map((name) => name.value).join(", ")}
----------------------
`;
    return BankCheckV1.cleanOutString(outStr);
  }
}
