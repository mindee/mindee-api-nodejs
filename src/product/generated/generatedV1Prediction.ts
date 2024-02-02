import { Prediction, cleanOutString } from "../../../src/parsing/common";
import { GeneratedListField, GeneratedObjectField } from "../../../src/parsing/generated";
import { StringField } from "../../../src/parsing/standard";


export class GeneratedV1Prediction implements Prediction {
  /** Map of all fields in the document. */
  fields: Map<string, GeneratedListField | StringField | GeneratedObjectField>;

  constructor() {
    this.fields = new Map();
  }

  toString(): string {
    let outStr = "";
    const pattern = /^(\n*[  ]*)( {2}):/;

    this.fields.forEach((fieldValue, fieldName) => {
      let strValue = "";

      if (
        fieldValue instanceof GeneratedListField &&
        fieldValue.values.length > 0
      ) {
        if (fieldValue.values[0] instanceof GeneratedObjectField) {
          // throw new MindeeError(fieldValue.values[0].toStringLevel(1) + "\n vs \n" + fieldValue.values[0].toStringLevel(1).replace(pattern, "$1* :"));
          strValue += fieldValue.values[0].toStringLevel(1).replace(pattern, "$1* :");
        } else {
          strValue += fieldValue.values[0].toString().replace(pattern, "$1* :") + "\n";
        }

        for (const subValue of fieldValue.values.slice(1)) {
          if (subValue instanceof GeneratedObjectField) {
            strValue += subValue.toStringLevel(1).replace(pattern, "$1* :");
          } else {
            strValue += ` ${" ".repeat(fieldName.length + 2)}${subValue}\n`;
          }
        }

        strValue = strValue.trimEnd();
      } else {
        strValue = fieldValue.toString();
      }

      outStr += `:${fieldName}: ${strValue}\n`;
    });

    return cleanOutString(outStr.trimEnd());
  }

  /**
   * Returns a dictionary of all fields that aren't a collection.
   */
  getSingleField(): Map<string, StringField> {
    const singleFields = new Map();
    for (const [fieldName, fieldValue] of Object.entries(this.fields)) {
      if (fieldValue instanceof StringField) {
        singleFields.set(fieldName, fieldValue);
      }
    }
    return singleFields;
  }

  /**
   * Returns a dictionary of all array-like fields.
   */
  getArrayFields(): Map<string, GeneratedListField> {
    const arrayFields = new Map();
    for (const [fieldName, fieldValue] of Object.entries(this.fields)) {
      if (fieldValue instanceof GeneratedListField) {
        arrayFields.set(fieldName, fieldValue);
      }
    }
    return arrayFields;
  }

  /**
   * Returns a dictionary of all object-like fields.
   */
  getObjectFields(): Map<string, GeneratedListField> {
    const objectFields = new Map();
    for (const [fieldName, fieldValue] of Object.entries(this.fields)) {
      if (fieldValue instanceof GeneratedObjectField) {
        objectFields.set(fieldName, fieldValue);
      }
    }
    return objectFields;
  }

  /**
   * Lists names of all top-level field keys.
   */
  listFieldNames(): string[] {
    return Object.keys(this.fields);
  }
}
