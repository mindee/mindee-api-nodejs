import { StringDict } from "../common";
import { StringField } from "../standard";
import { GeneratedObjectField, isGeneratedObject } from "./generatedObject";

export interface GeneratedListFieldConstructor {
  prediction: StringDict[];
  pageId?: number;
}

/**
 * A list of values or objects, used in generated APIs.
 */
export class GeneratedListField {
  /** Id of the page the object was found on. */
  pageId?: number;
  /** List of word values. */
  values: Array<GeneratedObjectField | StringField>;

  constructor({
    prediction = [],
    pageId = undefined,
  }: GeneratedListFieldConstructor) {
    this.values = [];

    for (const value of prediction) {
      if (value["page_id"] !== undefined && value["page_id"] !== null) {
        this.pageId = value["page_id"];
      }
      if (isGeneratedObject(value)) {
        this.values.push(new GeneratedObjectField({ prediction: value, pageId }));
      }
      else {
        const valueStr: StringDict = { ...value };
        if (valueStr["value"] !== null && valueStr["value"] !== undefined) {
          valueStr["value"] = value["value"].toString();
        }
        this.values.push(new StringField({ prediction: valueStr, pageId: pageId }));
      }
    }
  }
  /**
   * Returns an array of the contents of all values.
   */
  contentsList(): string[] {
    return this.values.map((item) => item.toString());
  }

  /**
   * Return a string representation of all values.
   * @param separator Character(s) to use when concatenating fields.
   * @returns string representation.
   */
  contentsString(separator: string = " "): string {
    return this.contentsList().map((item) => `${item.toString()}`).join(separator);
  }

  /**
   * Default string representation.
   */
  toString(): string {
    return this.contentsString();
  }
}
