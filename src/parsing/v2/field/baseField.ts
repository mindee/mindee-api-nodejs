import { FieldConfidence } from "./fieldConfidence";
import { FieldLocation } from "./fieldLocation";
import { StringDict } from "../../common";

export abstract class BaseField {
  protected _indentLevel: number;
  public locations: Array<FieldLocation> | undefined;
  public confidence: FieldConfidence | undefined;

  protected constructor(rawResponse: StringDict, indentLevel = 0) {
    this._indentLevel = indentLevel;
    if (rawResponse["locations"]) {
      this.locations = rawResponse["locations"].map((location: StringDict | undefined) => {
        return location ? new FieldLocation(location) : "";
      });
    }
    if (rawResponse["confidence"] !== undefined) {
      this.confidence = rawResponse["confidence"] as FieldConfidence;
    }
  }
}
