import { StringDict, cleanOutString } from "../../../parsing/common";
import { PositionField } from "../../../parsing/standard";

import { BankCheckV1Document } from "./bankCheckV1Document";

/**
 * Page data for Bank Check, API version 1.
 */
export class BankCheckV1Page extends BankCheckV1Document {
  /** The position of the check on the document. */
  checkPosition: PositionField;
  /** List of signature positions */
  signaturesPositions: PositionField[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    super(rawPrediction, pageId);

    this.checkPosition = new PositionField({
      prediction: rawPrediction["check_position"],
      pageId: pageId,
    });
    rawPrediction["signatures_positions"].map(
      (itemPrediction: StringDict) =>
        this.signaturesPositions.push(
          new PositionField({
            prediction: itemPrediction,
            pageId: pageId,
          })
        )
    );
  }

  toString(): string {
    const signaturesPositions = this.signaturesPositions.join("\n                      ");
    let outStr = `:Check Position: ${this.checkPosition}
:Signature Positions: ${signaturesPositions}`.trimEnd();
    outStr += "\n" + super.toString();
    return cleanOutString(outStr);
  }
}
