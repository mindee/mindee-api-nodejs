import { MindeeApiV2Error } from "../../errors/mindeeError";
import { StringDict } from "../common";
import { BaseField } from "./baseField";
import { ObjectField } from "./objectField";
import { SimpleField } from "./simpleField";

export class ListField extends BaseField {
  /**
   * Items contained in the list.
   */
  public items: Array<ListField | ObjectField | SimpleField>;

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(indentLevel);

    if (!Array.isArray(serverResponse["items"])) {
      throw new MindeeApiV2Error(
        `Expected "items" to be an array in ${JSON.stringify(serverResponse)}.`
      );
    }
    this.items = serverResponse["items"].map((item) => {
      return BaseField.createField(item, indentLevel + 1);
    });
  }

  toString(): string {
    if (this.items.length === 0) {
      return "";
    }
    const out = this.items
      .map((item) => `* ${item.toString().slice(2)}`)
      .join("");
    return "\n" + out;
  }
}
