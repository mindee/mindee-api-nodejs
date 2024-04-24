import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../parsing/common";
import { PositionField } from "../../parsing/standard";

/**
 * Multi Receipts Detector API version 1.0 document data.
 */
export class MultiReceiptsDetectorV1Document implements Prediction {
  /** Positions of the receipts on the document. */
  receipts: PositionField[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    rawPrediction["receipts"] &&
      rawPrediction["receipts"].map(
        (itemPrediction: StringDict) =>
          this.receipts.push(
            new PositionField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const receipts = this.receipts.join("\n                   ");
    const outStr = `:List of Receipts: ${receipts}`.trimEnd();
    return cleanOutString(outStr);
  }
}
