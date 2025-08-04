import { FieldConfidence } from "./fieldConfidence";
import { StringDict } from "../../common";
import { FieldLocation } from "./fieldLocation";

export abstract class BaseField {
  protected _indentLevel: number;
  public confidence: FieldConfidence | undefined;
  public locations: Array<FieldLocation> | undefined;

  protected constructor(rawResponse: StringDict, indentLevel = 0) {
    this._indentLevel = indentLevel;
    if ("confidence" in rawResponse && rawResponse["confidence"] !== null) {
      this.confidence = rawResponse["confidence"] as FieldConfidence;
    }
    if ("locations" in rawResponse && rawResponse["locations"]) {
      this.locations = rawResponse["locations"].map((location: StringDict | undefined) => {
        return location ? new FieldLocation(location) : "";
      });
    }
  }
}
