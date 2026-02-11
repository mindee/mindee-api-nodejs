import { InferenceFields } from "./inferenceFields";
import { StringDict } from "../../common";
import { BaseField } from "./baseField";
import type { SimpleField } from "./simpleField";
import type { ListField } from "./listField";

export class ObjectField extends BaseField {
  readonly fields: InferenceFields;

  public get simpleFields(): Map<string, SimpleField> {
    const result: Map<string, SimpleField> = new Map();
    for (const [fieldName, fieldValue] of this.fields) {
      if (fieldValue.constructor.name === "SimpleField") {
        result.set(fieldName, fieldValue as SimpleField);
      }
    }
    return result;
  }

  public get listFields(): Map<string, ListField> {
    const result: Map<string, ListField> = new Map();
    for (const [fieldName, fieldValue] of this.fields) {
      if (fieldValue.constructor.name === "ListField") {
        result.set(fieldName, fieldValue as ListField);
      }
    }
    return result;
  }

  public get objectFields(): Map<string, ObjectField> {
    const result: Map<string, ObjectField> = new Map();
    for (const [fieldName, fieldValue] of this.fields) {
      if (fieldValue.constructor.name === "ObjectField") {
        result.set(fieldName, fieldValue as ObjectField);
      }
    }
    return result;
  }

  public getSimpleField(fieldName: string): SimpleField | undefined {
    if (!this.fields.has(fieldName)) {
      throw new Error(`The field '${fieldName}' was not found.`);
    }
    if (this.fields.get(fieldName)?.constructor.name !== "SimpleField") {
      throw new Error(`The field '${fieldName}' is not a SimpleField.`);
    }
    return this.simpleFields.get(fieldName);
  }

  public getListField(fieldName: string): ListField | undefined {
    if (!this.fields.has(fieldName)) {
      throw new Error(`The field '${fieldName}' was not found.`);
    }
    if (this.fields.get(fieldName)?.constructor.name !== "ListField") {
      throw new Error(`The field '${fieldName}' is not a ListField.`);
    }
    return this.listFields.get(fieldName);
  }


  public getObjectField(fieldName: string): ObjectField | undefined {
    if (!this.fields.has(fieldName)) {
      throw new Error(`The field '${fieldName}' was not found.`);
    }
    if (this.fields.get(fieldName)?.constructor.name !== "ObjectField") {
      throw new Error(`The field '${fieldName}' is not an ObjectField.`);
    }
    return this.objectFields.get(fieldName);
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
