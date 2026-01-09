import {
  Prediction,
  StringDict,
  cleanOutString,
} from "@/parsing/common/index.js";
import { StringField } from "@/parsing/standard/index.js";

/**
 * Barcode Reader API version 1.0 document data.
 */
export class BarcodeReaderV1Document implements Prediction {
  /** List of decoded 1D barcodes. */
  codes1D: StringField[] = [];
  /** List of decoded 2D barcodes. */
  codes2D: StringField[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    rawPrediction["codes_1d"] &&
      rawPrediction["codes_1d"].map(
        (itemPrediction: StringDict) =>
          this.codes1D.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    rawPrediction["codes_2d"] &&
      rawPrediction["codes_2d"].map(
        (itemPrediction: StringDict) =>
          this.codes2D.push(
            new StringField({
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
    const codes1D = this.codes1D.join("\n              ");
    const codes2D = this.codes2D.join("\n              ");
    const outStr = `:Barcodes 1D: ${codes1D}
:Barcodes 2D: ${codes2D}`.trimEnd();
    return cleanOutString(outStr);
  }
}
