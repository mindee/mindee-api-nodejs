import { StringDict } from "../common";
import { BaseFieldConstructor, StringField } from "../standard";
import { GeneratedObjectField, isGeneratedObject } from "./generatedObject";

/**
 * A list of values or objects, used in generated APIs.
 */
export class GeneratedListField {
  /** Id of the page the object was found on. */
  pageId?: number;
  /** List of word values. */
  values: Array<GeneratedObjectField | StringField>;

  constructor({
    prediction = {},
    pageId,
  }: BaseFieldConstructor) {
    this.values = [];

    for (const value of Object.values(prediction)) {
      if (value["page_id"] !== undefined && value["page_id"] !== null) {
        this.pageId = value["page_id"];
      }
      if (isGeneratedObject(value)) {
        this.values.push(new GeneratedObjectField({prediction: value, pageId}));
      }
      else {
        const valueStr: StringDict = { ...value };
        if (value["value"] !== undefined && value["value"] !== null) {
          valueStr["value"] = value["value"].toString();
        }
        this.values.push(new StringField({ prediction: valueStr, pageId: pageId }));
      }
    }
  }
  /**
   * Returns an array of the contents of all values.
   */
  contentsList(): Array<string | number> {
    return this.values.map((item) => item.toString());
  }

  /**
   * Return a string representation of all values.
   * @param separator Character(s) to use when concatenating fields.
   * @returns string representation.
   */
  contentsString(separator: string = " "): string {
    return this.contentsList().map((item) => `${item}`).join(separator);
  }

  /**
   * Default string representation.
   */
  toString(): string {
    return this.contentsString();
  }
}
