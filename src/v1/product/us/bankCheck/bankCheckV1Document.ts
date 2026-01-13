import {
  Prediction,
  StringDict,
  cleanOutString,
} from "@/v1/parsing/common/index.js";
import {
  AmountField,
  DateField,
  StringField,
} from "@/v1/parsing/standard/index.js";

/**
 * Bank Check API version 1.1 document data.
 */
export class BankCheckV1Document implements Prediction {
  /** The check payer's account number. */
  accountNumber: StringField;
  /** The amount of the check. */
  amount: AmountField;
  /** The issuer's check number. */
  checkNumber: StringField;
  /** The date the check was issued. */
  date: DateField;
  /** List of the check's payees (recipients). */
  payees: StringField[] = [];
  /** The check issuer's routing number. */
  routingNumber: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.accountNumber = new StringField({
      prediction: rawPrediction["account_number"],
      pageId: pageId,
    });
    this.amount = new AmountField({
      prediction: rawPrediction["amount"],
      pageId: pageId,
    });
    this.checkNumber = new StringField({
      prediction: rawPrediction["check_number"],
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: rawPrediction["date"],
      pageId: pageId,
    });
    rawPrediction["payees"] &&
      rawPrediction["payees"].map(
        (itemPrediction: StringDict) =>
          this.payees.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.routingNumber = new StringField({
      prediction: rawPrediction["routing_number"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const payees = this.payees.join("\n         ");
    const outStr = `:Check Issue Date: ${this.date}
:Amount: ${this.amount}
:Payees: ${payees}
:Routing Number: ${this.routingNumber}
:Account Number: ${this.accountNumber}
:Check Number: ${this.checkNumber}`.trimEnd();
    return cleanOutString(outStr);
  }
}
