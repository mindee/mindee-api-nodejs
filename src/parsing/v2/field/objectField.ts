import { InferenceFields } from "./inferenceFields";
import { StringDict } from "../../common";
import { DynamicField } from "./dynamicField";

export class ObjectField extends DynamicField {
  readonly fields: InferenceFields;

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(serverResponse, indentLevel);

    this.fields = new InferenceFields(serverResponse["fields"], this._indentLevel + 1);
  }



  toString(): string {
    return "\n" + (this.fields ? this.fields.toString(1) : "");
  }

  toStringFromList(): string{
    return this.fields? this.fields.toString(2).substring(4) : "";
  }
}
