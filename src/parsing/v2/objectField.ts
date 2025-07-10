import { BaseField } from "./baseField";
import { ListField } from "./listField";
import { InferenceFields } from "./inferenceFields";
import { StringDict } from "../common";

export class ObjectField extends BaseField {
  readonly fields: InferenceFields;

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(indentLevel);

    this.fields = new InferenceFields(serverResponse["fields"], this._indentLevel + 1);
  }

  toString(): string {
    let out = "";
    for (const [key, value] of this.fields.entries()) {
      if (value instanceof ListField) {
        const needsValue = value.items.length > 0;
        const valueStr =
          needsValue && value.toString()
            ? " ".repeat(this._indentLevel) + value.toString()
            : "";
        out += `${" ".repeat(this._indentLevel)}:${key}: ${valueStr}`;
      } else {
        out += `${" ".repeat(this._indentLevel)}:${key}: ${value.toString()}`;
      }
    }
    return out;
  }
}
