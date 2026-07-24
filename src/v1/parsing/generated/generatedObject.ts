import { StringDict } from "@/parsing/stringDict.js";
import { BaseFieldConstructor, PositionField } from "@/v1/parsing/standard/index.js";


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

  /** All potentially present fields. */
  [key: string]: string | number | boolean | object | undefined;

  constructor({
    prediction = {},
    pageId,
  }: BaseFieldConstructor) {
    let itemPageId = null;
    this.printableValues = [];
    for (const [fieldName, fieldValue] of Object.entries(prediction)) {
      if (fieldName === "page_id") {
        itemPageId = fieldValue;
      } else if (fieldName === "confidence") {
        this.confidence = fieldValue;
      } else if (fieldName === "raw_value") {
        this.rawValue = fieldValue;
      } else if (GeneratedObjectField.isPositionField(fieldName)) {
        this.assignPositionField(fieldName, fieldValue, pageId);
      } else {
        this.assignScalarField(fieldName, fieldValue);
      }
      this.pageId = pageId ?? itemPageId;
    }
  }

  private static readonly positionFieldNames: ReadonlySet<string> = new Set([
    "polygon", "rectangle", "quadrangle", "bounding_box",
  ]);

  private static isPositionField(fieldName: string): boolean {
    return GeneratedObjectField.positionFieldNames.has(fieldName);
  }

  private assignPositionField(fieldName: string, fieldValue: unknown, pageId?: number): void {
    Object.assign(this, {
      [fieldName]: new PositionField({
        prediction: { [fieldName]: fieldValue },
        valueKey: fieldName,
        pageId: pageId,
      }),
    });
    this.printableValues.push(fieldName);
  }

  private assignScalarField(fieldName: string, fieldValue: unknown): void {
    if (
      typeof fieldValue === "number" &&
      !isNaN(fieldValue) &&
      fieldName !== "degrees"
    ) {
      Object.assign(this, { [fieldName]: this.toNumberString(fieldValue) });
    } else if (typeof fieldValue === "boolean") {
      Object.assign(this, { [fieldName]: fieldValue });
    } else {
      Object.assign(this, {
        [fieldName]: (fieldValue !== undefined && fieldValue !== null) ? String(fieldValue) : null,
      });
    }
    this.printableValues.push(fieldName);
  }

  /**
   * ReSTructured-compliant string representation.
   Takes into account level of indentation & displays elements as list elements.
   * @param level Level of indentation. 0 by default.
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
      return n + ".0";
    }
    return n.toString();
  }

  /** Returns the default string representation. */
  toString() {
    return this.toStringLevel();
  }

  /** Returns a field value by key from this generated object. */
  get(fieldName: string): string | number | boolean | object | undefined {
    return this[fieldName];
  }
}


/**
 * Checks whether a field is a custom object or not.
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
