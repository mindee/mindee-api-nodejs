import { InferenceFields } from "./inferenceFields.js";
import { StringDict } from "@/parsing/stringDict.js";
import { BaseField } from "./baseField.js";
import type { SimpleField } from "./simpleField.js";
import type { ListField } from "./listField.js";

/**
 * Object-valued inference field.
 */
export class ObjectField extends BaseField {
  /**
   * Nested fields carried by this object.
   */
  readonly fields: InferenceFields;

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(serverResponse, indentLevel);

    this.fields = new InferenceFields(serverResponse["fields"], this._indentLevel + 1);
  }

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
   * @return {SimpleField} The field instance if it exists and is valid, or undefined if not.
   * @throws {Error} If the field does not exist or is of wrong type.
   */
  public getSimpleField(fieldName: string): SimpleField {
    return this.fields.getSimpleField(fieldName);
  }

  /**
   * Retrieves a ListField by its name if it exists and is of the correct type.
   *
   * @param {string} fieldName - The name of the field to retrieve.
   * @return {ListField} The field instance if it exists and is valid, or undefined if not.
   * @throws {Error} If the field does not exist or is of wrong type.
   */
  public getListField(fieldName: string): ListField {
    return this.fields.getListField(fieldName);
  }

  /**
   * Retrieves an ObjectField by its name if it exists and is of the correct type.
   *
   * @param {string} fieldName - The name of the field to retrieve.
   * @return {ObjectField} The field instance if it exists and is valid, or undefined if not.
   * @throws {Error} If the field does not exist or is of wrong type.
   */
  public getObjectField(fieldName: string): ObjectField {
    return this.fields.getObjectField(fieldName);
  }

  /**
   * Returns a readable representation of nested fields.
   */
  toString(): string {
    return "\n" + (this.fields ? this.fields.toString(1) : "");
  }

  /**
   * Returns a compact representation suitable for list items.
   */
  toStringFromList(): string{
    return this.fields? this.fields.toString(2).substring(4) : "";
  }
}
