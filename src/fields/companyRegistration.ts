import { Field, FieldConstructor } from "./field";

export class CompanyRegistration extends Field {
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
