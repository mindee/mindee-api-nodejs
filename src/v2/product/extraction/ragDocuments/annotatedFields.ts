import { AnnotatedSimpleField } from "./annotatedSimpleField.js";
import { AnnotatedObjectField } from "./annotatedObjectField.js";
import { AnnotatedListField } from "./annotatedListField.js";
import { StringDict } from "@/parsing/index.js";
import { createAnnotatedField } from "@/v2/product/extraction/ragDocuments/fieldFactory.js";

/**
 * A dictionary of field names and their corresponding configured field types.
 */
export class AnnotatedFields extends Map<string, AnnotatedSimpleField | AnnotatedObjectField | AnnotatedListField> {
  constructor(serverResponse: StringDict) {
    super(Object.entries(serverResponse).map( ([key, value]) => {
      return [key, createAnnotatedField(value)];
    }));
  }

  /**
   * Returns a field as an `AnnotatedSimpleField`, or throws if the type mismatches.
   */
  getSimpleField(fieldName: string): AnnotatedSimpleField {
    const field = this.get(fieldName);
    if (field === undefined) {
      throw new Error(`The field '${fieldName}' was not found.`);
    }
    if (field.constructor.name !== "AnnotatedSimpleField") {
      throw new Error(`The field '${fieldName}' is not a AnnotatedSimpleField.`);
    }
    return field as AnnotatedSimpleField;
  }

  /**
   * Returns a field as an `AnnotatedObjectField`, or throws if the type mismatches.
   */
  getObjectField(fieldName: string): AnnotatedObjectField {
    const field = this.get(fieldName);
    if (field === undefined) {
      throw new Error(`The field '${fieldName}' was not found.`);
    }
    if (field.constructor.name !== "AnnotatedObjectField") {
      throw new Error(`The field '${fieldName}' is not an ObjectField.`);
    }
    return field as AnnotatedObjectField;
  }

  /**
   * Returns a field as an `AnnotatedListField`, or throws if the type mismatches.
   */
  getListField(fieldName: string): AnnotatedListField {
    const field = this.get(fieldName);
    if (field === undefined) {
      throw new Error(`The field '${fieldName}' was not found.`);
    }
    if (field.constructor.name !== "AnnotatedListField") {
      throw new Error(`The field '${fieldName}' is not a ListField.`);
    }
    return field as AnnotatedListField;
  }

  /**
   * Serializes the fields to API format.
   * Needed because a `Map` is otherwise serialized as an empty object by `JSON.stringify`.
   */
  toJSON(): Record<string, AnnotatedSimpleField | AnnotatedObjectField | AnnotatedListField> {
    return Object.fromEntries(this);
  }
}
