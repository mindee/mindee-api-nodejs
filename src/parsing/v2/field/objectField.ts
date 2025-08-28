import { InferenceFields } from "./inferenceFields";
import { StringDict } from "../../common";
import { BaseField } from "./baseField";
import type { SimpleField } from "./simpleField";

export class ObjectField extends BaseField {
  readonly fields: InferenceFields;

  public get simpleFields(): Map<string, SimpleField> {
    const result: Map<string, SimpleField> = new Map();
    for (const [fieldName, fieldValue] of this.fields) {
      if (fieldValue.constructor.name === "SimpleField") {
        result.set(fieldName, fieldValue as SimpleField);
      } else {
        throw new Error(`The field '${fieldName}' is not a SimpleField.`);
      }
    }
    return result;
  }

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
