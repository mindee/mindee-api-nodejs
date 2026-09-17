import { MindeeDeserializationError } from "@/errors/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { AnnotatedBaseField } from "./annotatedBaseField.js";
import { AnnotatedObjectField } from "./annotatedObjectField.js";
import { AnnotatedSimpleField } from "./annotatedSimpleField.js";
import { createAnnotatedField } from "./fieldFactory.js";

/** List-valued inference field. */
export class AnnotatedListField extends AnnotatedBaseField {
  /**
   * Items contained in the list.
   */
  public items: Array<AnnotatedListField | AnnotatedObjectField | AnnotatedSimpleField>;

  constructor(serverResponse: StringDict) {
    super(serverResponse["selected"], serverResponse["guidelines"]);

    if (!Array.isArray(serverResponse["items"])) {
      throw new MindeeDeserializationError(
        `Expected "items" to be an array in ${JSON.stringify(serverResponse)}.`
      );
    }
    this.items = serverResponse["items"].map((item) => {
      return createAnnotatedField(item);
    });
  }

  /**
   * AnnotatedSimpleField items from the list.
   */
  public get simpleItems(): Array<AnnotatedSimpleField> {
    const result: Array<AnnotatedSimpleField> = [];

    for (const item of this.items) {
      if (item instanceof AnnotatedSimpleField) {
        result.push(item);
      } else {
        throw new MindeeDeserializationError(
          `All items must be AnnotatedSimpleField, found item of type ${item.constructor.name}.`
        );
      }
    }
    return result;
  }

  /**
   * AnnotatedObjectField items from the list.
   */
  public get objectItems(): Array<AnnotatedObjectField> {
    const result: Array<AnnotatedObjectField> = [];

    for (const item of this.items) {
      if (item instanceof AnnotatedObjectField) {
        result.push(item);
      } else {
        throw new MindeeDeserializationError(
          `All items must be AnnotatedObjectField, found item of type ${item.constructor.name}.`
        );
      }
    }
    return result;
  }

  /** Returns a readable representation of list items. */
  toString(): string {
    if (!this.items || this.items.length === 0) {
      return "\n";
    }

    const parts: string[] = [""];
    for (const item of this.items) {
      if (!item) continue;

      if (item instanceof AnnotatedObjectField) {
        parts.push(item.toStringFromList());
      } else {
        parts.push(item.toString());
      }
    }
    return parts.join("\n  * ");
  }

}
