import { StringDict } from "../common";
import type { ListField } from "./listField";
import type { ObjectField } from "./objectField";
import type { SimpleField } from "./simpleField";


export class InferenceFields extends Map<string, SimpleField | ObjectField | ListField> {
  protected _indentLevel: number;

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(Object.entries(serverResponse));
    this._indentLevel = indentLevel;
  }

  toString(): string {
    let outStr = "";

    for (const [fieldKey, fieldValue] of this.entries()) {
      const indent = " ".repeat(this._indentLevel);

      if (
        fieldValue &&
        fieldValue.constructor.name === "ListField"
      ) {
        const listField = fieldValue as ListField;
        let valueStr = indent;

        if (Array.isArray(listField.items) && listField.items.length > 0) {
          valueStr = indent + listField.toString();
        }

        outStr += `${indent}:${fieldKey}: ${valueStr}`;
      } else if (
        fieldValue &&
        fieldValue.constructor.name === "ObjectField"
      ) {
        const objectField = fieldValue as ObjectField;
        outStr += `${indent}:${fieldKey}: ${objectField.fields.toString()}`;
      } else if (
        fieldValue &&
        fieldValue.constructor.name === "SimpleField"
      ) {
        const simpleField = fieldValue as SimpleField;
        const simpleStr = simpleField.toString();
        outStr += `${indent}:${fieldKey}: ${simpleStr}`;
      } else {
        outStr += `${indent}:${fieldKey}: `;
      }

      outStr += "\n";
    }
    return outStr.trimEnd();
  }

}
