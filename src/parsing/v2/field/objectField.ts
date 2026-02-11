import { InferenceFields } from "./inferenceFields";
import { StringDict } from "../../common";
import { BaseField } from "./baseField";
import type { SimpleField } from "./simpleField";
import type { ListField } from "./listField";

export class ObjectField extends BaseField {
  readonly fields: InferenceFields;

  /**
   * Retrieves the simple sub-fields in the object.
   *
   * @return {Map<string, SimpleField>} A map of field names to their corresponding `SimpleField` instances.
   */
  public get simpleFields(): Map<string, SimpleField> {
    const result: Map<string, SimpleField> = new Map();
    for (const [fieldName, fieldValue] of this.fields) {
      if (fieldValue.constructor.name === "SimpleField") {
        result.set(fieldName, fieldValue as SimpleField);
      }
    }
    return result;
  }

  /**
   * Retrieves the list sub-fields in the object.
   *
   * @return {Map<string, ListField>} A map of field names to their corresponding `ListField` instances.
   */
  public get listFields(): Map<string, ListField> {
    const result: Map<string, ListField> = new Map();
    for (const [fieldName, fieldValue] of this.fields) {
      if (fieldValue.constructor.name === "ListField") {
        result.set(fieldName, fieldValue as ListField);
      }
    }
    return result;
  }

  /**
   * Retrieves the object sub-fields in the object.
   *
   * @return {Map<string, ObjectField>} A map of field names to their corresponding `ObjectField` instances.
   */
  public get objectFields(): Map<string, ObjectField> {
    const result: Map<string, ObjectField> = new Map();
    for (const [fieldName, fieldValue] of this.fields) {
      if (fieldValue.constructor.name === "ObjectField") {
        result.set(fieldName, fieldValue as ObjectField);
      }
    }
    return result;
  }

  /**
   * Retrieves a SimpleField by its name if it exists and is of the correct type.
   *
   * @param {string} fieldName - The name of the field to retrieve.
   * @return {SimpleField} The SimpleField instance if it exists and is valid, or undefined if not.
   * @throws {Error} If the field does not exist or is not of type SimpleField.
   */
  public getSimpleField(fieldName: string): SimpleField {
    if (!this.fields.has(fieldName) && !this.simpleFields.has(fieldName)) {
      throw new Error(`The field '${fieldName}' was not found.`);
    }
    if (this.fields.get(fieldName)?.constructor.name !== "SimpleField") {
      throw new Error(`The field '${fieldName}' is not a SimpleField.`);
    }
    return this.simpleFields.get(fieldName) as SimpleField;
  }

  /**
   * Retrieves a ListField by its name if it exists and is of the correct type.
   *
   * @param {string} fieldName - The name of the field to retrieve.
   * @return {ListField} The ListField instance if it exists and is valid, or undefined if not.
   * @throws {Error} If the field does not exist or is not of type ListField.
   */
  public getListField(fieldName: string): ListField {
    if (!this.fields.has(fieldName) || !this.listFields.has(fieldName)) {
      throw new Error(`The field '${fieldName}' was not found.`);
    }
    if (this.fields.get(fieldName)?.constructor.name !== "ListField") {
      throw new Error(`The field '${fieldName}' is not a ListField.`);
    }
    return this.listFields.get(fieldName) as ListField;
  }


  /**
   * Retrieves an ObjectField by its name if it exists and is of the correct type.
   *
   * @param {string} fieldName - The name of the field to retrieve.
   * @return {ObjectField} The ObjectField instance if it exists and is valid, or undefined if not.
   * @throws {Error} If the field does not exist or is not of type ObjectField.
   */
  public getObjectField(fieldName: string): ObjectField {
    if (!this.fields.has(fieldName) && !this.objectFields.has(fieldName)) {
      throw new Error(`The field '${fieldName}' was not found.`);
    }
    if (this.fields.get(fieldName)?.constructor.name !== "ObjectField") {
      throw new Error(`The field '${fieldName}' is not an ObjectField.`);
    }
    return this.objectFields.get(fieldName) as ObjectField;
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
