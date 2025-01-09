import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "../../../parsing/common";
import { UsMailV3SenderAddress } from "./usMailV3SenderAddress";
import { UsMailV3RecipientAddress } from "./usMailV3RecipientAddress";
import { BooleanField, StringField } from "../../../parsing/standard";

/**
 * US Mail API version 3.0 document data.
 */
export class UsMailV3Document implements Prediction {
  /** Whether the mailing is marked as return to sender. */
  isReturnToSender: BooleanField;
  /** The addresses of the recipients. */
  recipientAddresses: UsMailV3RecipientAddress[] = [];
  /** The names of the recipients. */
  recipientNames: StringField[] = [];
  /** The address of the sender. */
  senderAddress: UsMailV3SenderAddress;
  /** The name of the sender. */
  senderName: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.isReturnToSender = new BooleanField({
      prediction: rawPrediction["is_return_to_sender"],
      pageId: pageId,
    });
    rawPrediction["recipient_addresses"] &&
      rawPrediction["recipient_addresses"].map(
        (itemPrediction: StringDict) =>
          this.recipientAddresses.push(
            new UsMailV3RecipientAddress({
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
    this.senderAddress = new UsMailV3SenderAddress({
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
      const recipientAddressesColSizes:number[] = [17, 37, 19, 13, 24, 7, 27, 17];
      recipientAddressesSummary += "\n" + lineSeparator(recipientAddressesColSizes, "-") + "\n  ";
      recipientAddressesSummary += "| City            ";
      recipientAddressesSummary += "| Complete Address                    ";
      recipientAddressesSummary += "| Is Address Change ";
      recipientAddressesSummary += "| Postal Code ";
      recipientAddressesSummary += "| Private Mailbox Number ";
      recipientAddressesSummary += "| State ";
      recipientAddressesSummary += "| Street                    ";
      recipientAddressesSummary += "| Unit            ";
      recipientAddressesSummary += "|\n" + lineSeparator(recipientAddressesColSizes, "=");
      recipientAddressesSummary += this.recipientAddresses.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(recipientAddressesColSizes, "-")
      ).join("");
    }
    const outStr = `:Sender Name: ${this.senderName}
:Sender Address: ${this.senderAddress.toFieldList()}
:Recipient Names: ${recipientNames}
:Recipient Addresses: ${recipientAddressesSummary}
:Return to Sender: ${this.isReturnToSender}`.trimEnd();
    return cleanOutString(outStr);
  }
}
