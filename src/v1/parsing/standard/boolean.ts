import { StringDict } from "@/parsing/stringDict.js";
import { Field } from "./field.js";

export interface FieldConstructor {
  prediction: StringDict;
  valueKey?: string;
  reconstructed?: boolean;
  pageId?: number | undefined;
}

/**
 * A field containing a text value.
 */
export class BooleanField extends Field {
  /** The value. */
  value?: boolean;

  constructor({
    prediction = {},
    valueKey = "value",
    reconstructed = false,
    pageId,
  }: FieldConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });
  }

  toString(): string {
    if (this.value === true) {
      return "True";
    } else if (this.value === false) {
      return "False";
    }
    return "";
  }
}
