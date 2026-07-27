import { FieldConfidence } from "./fieldConfidence.js";
import { StringDict } from "@/parsing/stringDict.js";
import { FieldLocation } from "./fieldLocation.js";

export abstract class BaseField {
  /** Indentation level used when rendering field text output. */
  protected _indentLevel: number;
  /** Confidence level associated with this field. */
  public confidence: FieldConfidence | undefined;
  /** Optional list of source locations for this field. */
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
