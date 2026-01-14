import { MindeeDeserializationError } from "@/errors/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { BaseField } from "./baseField.js";
import { ObjectField } from "./objectField.js";
import { SimpleField } from "./simpleField.js";
import { createField } from "./fieldFactory.js";

export class ListField extends BaseField {
  /**
   * Items contained in the list.
   */
  public items: Array<ListField | ObjectField | SimpleField>;

  /**
   * SimpleField items from the list.
   */
  public get simpleItems(): Array<SimpleField> {
    const result: Array<SimpleField> = [];

    for (const item of this.items) {
      if (item instanceof SimpleField) {
        result.push(item);
      } else {
        throw new MindeeDeserializationError(
          `All items must be SimpleField, found item of type ${item.constructor.name}.`
        );
      }
    }
    return result;
  }

  /**
   * SimpleField items from the list.
   */
  public get objectItems(): Array<ObjectField> {
    const result: Array<ObjectField> = [];

    for (const item of this.items) {
      if (item instanceof ObjectField) {
        result.push(item);
      } else {
        throw new MindeeDeserializationError(
          `All items must be ObjectField, found item of type ${item.constructor.name}.`
        );
      }
    }
    return result;
  }

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(serverResponse, indentLevel);

    if (!Array.isArray(serverResponse["items"])) {
      throw new MindeeDeserializationError(
        `Expected "items" to be an array in ${JSON.stringify(serverResponse)}.`
      );
    }
    this.items = serverResponse["items"].map((item) => {
      return createField(item, indentLevel + 1);
    });
  }

  toString(): string {
    if (!this.items || this.items.length === 0) {
      return "\n";
    }

    const parts: string[] = [""];
    for (const item of this.items) {
      if (!item) continue;

      if (item instanceof ObjectField) {
        parts.push(item.toStringFromList());
      } else {
        parts.push(item.toString());
      }
    }
    return parts.join("\n  * ");
  }

}
