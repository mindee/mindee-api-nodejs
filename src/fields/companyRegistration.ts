import { Field, FieldConstructor } from "./field";

export class CompanyRegistration extends Field {
  /** Type of company registration number. */
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
