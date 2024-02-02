import { StringDict } from "../common";
import { BaseFieldConstructor, PositionField } from "../standard";


/** A JSON-like object, with miscellaneous values. */
export class GeneratedObjectField {

  /** The document page on which the information was found. */
  pageId?: number;
  /** Confidence with which the value was assessed. */
  confidence?: number;
  /** Raw unprocessed value, as it was sent by the server. */
  rawValue?: string;
  /** List of all printable field names. */
  private printableValues: string[];

  constructor({
    prediction = {},
    pageId,
  }: BaseFieldConstructor) {
    let itemPageId = null;
    this.printableValues = [];
    for (const [name, value] of Object.entries(prediction)) {
      if (name === "page_id") {
        itemPageId = value;
      } else if (["polygon", "rectangle", "quadrangle", "bounding_box"].includes(name)) {
        Object.assign(this, { [name]: new PositionField({ prediction: { [name]: value }, valueKey: name, pageId: pageId }) });
        this.printableValues.push(name);
      } else if (name === "confidence") {
        this.confidence = value;
      } else if (name === "raw_value") {
        this.rawValue = value;
      } else {
        if (value !== null && value !== undefined && !isNaN(value) && name !== "degrees") {
          Object.assign(this, { [name]: this.toNumberString(value) });
        } else {
          Object.assign(this, { [name]: (value !== undefined && value !== null) ? String(value) : null });
        }
        this.printableValues.push(name);
      }
      this.pageId = pageId ?? itemPageId;
    }
  }

  /**
   * ReSTructured-compliant string representation.
     Takes into account level of indentation & displays elements as list elements.
   * @param level Lvel of indentation. 0 by default.
   */
  toStringLevel(level: number = 0): string {
    const indent = "  " + "  ".repeat(level);
    let outStr = "";
    this.printableValues.forEach((printableValue) => {
      const strValue = (this as any)[printableValue];
      outStr += `\n${indent}:${printableValue}: ${strValue !== null && strValue !== undefined ? strValue : ""}`;
    });
    return `\n${indent}${outStr.trim()}`;
  }

  /**
   * Formats a float number to have at least one decimal place.
   * @param n Input number.
   * @returns 
   */
  private toNumberString(n: number): string {
    if (Number.isInteger(n)) {
      return n + ".0"
    }
    return n.toString();
  }

  toString() {
    return this.toStringLevel();
  }
}


/**
 * Checks whether an field is a custom object or not.
 * @param strDict input dictionary to check.
 */
export function isGeneratedObject(strDict: StringDict): boolean {
  const commonKeys = [
    "value",
    "polygon",
    "rectangle",
    "page_id",
    "confidence",
    "quadrangle",
    "values",
    "raw_value",
  ];

  for (const key in strDict) {
    if (Object.prototype.hasOwnProperty.call(strDict, key) && !commonKeys.includes(key)) {
      return true;
    }
  }
  return false;
}
