import { AnnotatedBaseField } from "./annotatedBaseField.js";
import { StringDict } from "@/parsing/index.js";
import { AnnotatedFields } from "./annotatedFields.js";
import { AnnotatedSimpleField } from "@/v2/product/extraction/ragDocuments/annotatedSimpleField.js";
import { AnnotatedListField } from "@/v2/product/extraction/ragDocuments/annotatedListField.js";

export class AnnotatedObjectField extends AnnotatedBaseField {
  /** Nested fields carried by this object. */
  readonly fields: AnnotatedFields;

  constructor(serverResponse: StringDict) {
    super(serverResponse["selected"], serverResponse["guidelines"]);

    this.fields = new AnnotatedFields(serverResponse["fields"]);
  }

  /**
   * Retrieves a AnnotatedSimpleField by its name if it exists and is of the correct type.
   *
   * @param {string} fieldName - The name of the field to retrieve.
   * @return {AnnotatedSimpleField} The field instance if it exists and is valid, or undefined if not.
   * @throws {Error} If the field does not exist or is of wrong type.
   */
  public getSimpleField(fieldName: string): AnnotatedSimpleField {
    return this.fields.getSimpleField(fieldName);
  }

  /**
   * Retrieves a AnnotatedListField by its name if it exists and is of the correct type.
   *
   * @param {string} fieldName - The name of the field to retrieve.
   * @return {AnnotatedListField} The field instance if it exists and is valid, or undefined if not.
   * @throws {Error} If the field does not exist or is of wrong type.
   */
  public getListField(fieldName: string): AnnotatedListField {
    return this.fields.getListField(fieldName);
  }

  /**
   * Retrieves an AnnotatedObjectField by its name if it exists and is of the correct type.
   *
   * @param {string} fieldName - The name of the field to retrieve.
   * @return {AnnotatedObjectField} The field instance if it exists and is valid, or undefined if not.
   * @throws {Error} If the field does not exist or is of wrong type.
   */
  public getObjectField(fieldName: string): AnnotatedObjectField {
    return this.fields.getObjectField(fieldName);
  }

  /**
   * Returns a compact representation suitable for list items.
   */
  toStringFromList(): string{
    return this.fields? this.fields.toString().substring(4) : "";
  }
}
