import { Field, FieldConstructor } from "./field";

/**
 * A company registration item.
 */
export class CompanyRegistrationField extends Field {
  /** Registration identifier. */
  value?: string;
  /** Type of company registration. */
  type: string;

  constructor({
    prediction,
    valueKey = "value",
    reconstructed = false,
    pageId,
  }: FieldConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });
    this.type = prediction.type;
  }
}
