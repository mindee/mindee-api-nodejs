import { StringDict } from "./base";
import { Field } from "./field";

export interface FieldConstructor {
  prediction: StringDict;
  valueKey?: string;
  reconstructed?: boolean;
  pageId?: number | undefined;
}

export class TextField extends Field {
  /** The value. */
  value?: string;

  constructor({
    prediction,
    valueKey = "value",
    reconstructed = false,
    pageId,
  }: FieldConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });
  }
}
