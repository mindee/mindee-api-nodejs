import { MindeeApiV2Error } from "../../../errors/mindeeError";
import { StringDict } from "../../common";
import { BaseField } from "./baseField";
import { ObjectField } from "./objectField";
import { SimpleField } from "./simpleField";
import { createField } from "./fieldFactory";

export class ListField extends BaseField {
  /**
   * Items contained in the list.
   */
  public items: Array<ListField | ObjectField | SimpleField>;

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(serverResponse, indentLevel);

    if (!Array.isArray(serverResponse["items"])) {
      throw new MindeeApiV2Error(
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
