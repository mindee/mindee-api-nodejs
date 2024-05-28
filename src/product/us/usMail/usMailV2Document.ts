import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "../../../parsing/common";
import { UsMailV2SenderAddress } from "./usMailV2SenderAddress";
import { UsMailV2RecipientAddress } from "./usMailV2RecipientAddress";
import { StringField } from "../../../parsing/standard";

/**
 * US Mail API version 2.0 document data.
 */
export class UsMailV2Document implements Prediction {
  /** The addresses of the recipients. */
  recipientAddresses: UsMailV2RecipientAddress[] = [];
  /** The names of the recipients. */
  recipientNames: StringField[] = [];
  /** The address of the sender. */
  senderAddress: UsMailV2SenderAddress;
  /** The name of the sender. */
  senderName: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    rawPrediction["recipient_addresses"] &&
      rawPrediction["recipient_addresses"].map(
        (itemPrediction: StringDict) =>
          this.recipientAddresses.push(
            new UsMailV2RecipientAddress({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    rawPrediction["recipient_names"] &&
      rawPrediction["recipient_names"].map(
        (itemPrediction: StringDict) =>
          this.recipientNames.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.senderAddress = new UsMailV2SenderAddress({
      prediction: rawPrediction["sender_address"],
      pageId: pageId,
    });
    this.senderName = new StringField({
      prediction: rawPrediction["sender_name"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const recipientNames = this.recipientNames.join("\n                  ");
    let recipientAddressesSummary:string = "";
    if (this.recipientAddresses && this.recipientAddresses.length > 0) {
      const recipientAddressesColSizes:number[] = [17, 37, 19, 13, 24, 7, 27];
      recipientAddressesSummary += "\n" + lineSeparator(recipientAddressesColSizes, "-") + "\n  ";
      recipientAddressesSummary += "| City            ";
      recipientAddressesSummary += "| Complete Address                    ";
      recipientAddressesSummary += "| Is Address Change ";
      recipientAddressesSummary += "| Postal Code ";
      recipientAddressesSummary += "| Private Mailbox Number ";
      recipientAddressesSummary += "| State ";
      recipientAddressesSummary += "| Street                    ";
      recipientAddressesSummary += "|\n" + lineSeparator(recipientAddressesColSizes, "=");
      recipientAddressesSummary += this.recipientAddresses.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(recipientAddressesColSizes, "-")
      ).join("");
    }
    const outStr = `:Sender Name: ${this.senderName}
:Sender Address: ${this.senderAddress.toFieldList()}
:Recipient Names: ${recipientNames}
:Recipient Addresses: ${recipientAddressesSummary}`.trimEnd();
    return cleanOutString(outStr);
  }
}
