import { FieldConfidence } from "./fieldConfidence";
import { StringDict } from "../../common";

export abstract class BaseField {
  protected _indentLevel: number;
  public confidence: FieldConfidence | undefined;

  protected constructor(rawResponse: StringDict, indentLevel = 0) {
    this._indentLevel = indentLevel;
    if (rawResponse["confidence"] !== undefined) {
      this.confidence = rawResponse["confidence"] as FieldConfidence;
    }
  }
}
