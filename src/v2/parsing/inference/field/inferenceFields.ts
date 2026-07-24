import { StringDict } from "@/parsing/stringDict.js";
import type { ListField } from "./listField.js";
import type { ObjectField } from "./objectField.js";
import type { SimpleField } from "./simpleField.js";
import { createField } from "./fieldFactory.js";


/** Typed map of extraction fields returned by the API. */
export class InferenceFields extends Map<string, SimpleField | ObjectField | ListField> {
  /** Indentation level used when rendering text output. */
  protected _indentLevel: number;

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(Object.entries(serverResponse).map( ([key, value]) => {
      return [key, createField(value, 1)];
    }));
    this._indentLevel = indentLevel;
  }

  /** Returns a field as a `SimpleField`, or throws if the type mismatches. */
  getSimpleField(fieldName: string): SimpleField {
    const field = this.get(fieldName);
    if (field === undefined) {
      throw new Error(`The field '${fieldName}' was not found.`);
    }
    if (field.constructor.name !== "SimpleField") {
      throw new Error(`The field '${fieldName}' is not a SimpleField.`);
    }
    return field as SimpleField;
  }

  /** Returns a field as an `ObjectField`, or throws if the type mismatches. */
  getObjectField(fieldName: string): ObjectField {
    const field = this.get(fieldName);
    if (field === undefined) {
      throw new Error(`The field '${fieldName}' was not found.`);
    }
    if (field.constructor.name !== "ObjectField") {
      throw new Error(`The field '${fieldName}' is not an ObjectField.`);
    }
    return field as ObjectField;
  }

  /** Returns a field as a `ListField`, or throws if the type mismatches. */
  getListField(fieldName: string): ListField {
    const field = this.get(fieldName);
    if (field === undefined) {
      throw new Error(`The field '${fieldName}' was not found.`);
    }
    if (field.constructor.name !== "ListField") {
      throw new Error(`The field '${fieldName}' is not a ListField.`);
    }
    return field as ListField;
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
        const val = fieldValue.toString();
        line += val.length > 0 ? " " + val.toString() : "";
      }

      lines.push(line);
    }

    return lines.join("\n").trimEnd();
  }
}
