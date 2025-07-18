import { StringDict } from "../../common";
import type { ListField } from "./listField";
import type { ObjectField } from "./objectField";
import type { SimpleField } from "./simpleField";
import { createField } from "./fieldFactory";


export class InferenceFields extends Map<string, SimpleField | ObjectField | ListField> {
  protected _indentLevel: number;

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(Object.entries(serverResponse).map( ([key, value]) => {
      return [key, createField(value, 1)];
    }));
    this._indentLevel = indentLevel;
  }

  toString(indent: number = this._indentLevel): string {
    if (this.size === 0) {
      return "";
    }

    const padding = "  ".repeat(indent);
    const lines: string[] = [];

    for (const [fieldKey, fieldValue] of this.entries()) {
      let line = `${padding}:${fieldKey}:`;

      if (fieldValue.constructor.name === "ListField") {
        const listField = fieldValue as ListField;
        if (Array.isArray(listField.items) && listField.items.length > 0) {
          line += listField.toString();
        }
      } else if (fieldValue.constructor.name === "ObjectField") {
        line += fieldValue.toString();
      } else if (fieldValue.constructor.name === "SimpleField") {
        const val = (fieldValue as SimpleField).value;
        line += val !== null && val !== undefined ? " " + val.toString() : "";
      }

      lines.push(line);
    }

    return lines.join("\n").trimEnd();
  }
}
