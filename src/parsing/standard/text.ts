import { StringDict } from "../common";
import { Field } from "./field";

export interface FieldConstructor {
  prediction: StringDict;
  valueKey?: string;
  reconstructed?: boolean;
  pageId?: number | undefined;
}

/**
 * A field containing a text value.
 */
export class StringField extends Field {
  /** The value. */
  value?: string;

  constructor({
    prediction = {},
    valueKey = "value",
    reconstructed = false,
    pageId,
  }: FieldConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });
  }
}
