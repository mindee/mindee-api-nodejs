import { StringDict } from "../../common";
import { BaseField } from "./baseField";

export class SimpleField extends BaseField {
  readonly value: string | number | boolean | null;

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(serverResponse, indentLevel);
    this.value =
      serverResponse["value"] !== undefined ? (serverResponse["value"] as any) : null;
  }

  /**
   * Retrieves a string field value as a string.
   */
  public get stringValue(): string | null {
    if (this.value !== null && typeof this.value !== "string") {
      throw new Error("Value is not a string");
    }
    return this.value as string;
  }

  /**
   * Retrieves a number field value as a number.
   */
  public get numberValue(): number | null {
    if (this.value !== null && typeof this.value !== "number") {
      throw new Error("Value is not a number");
    }
    return this.value as number;
  }

  /**
   * Retrieves a boolean field value as a boolean.
   */
  public get booleanValue(): boolean | null {
    if (this.value !== null && typeof this.value !== "boolean") {
      throw new Error("Value is not a boolean");
    }
    return this.value as boolean;
  }

  toString(): string {
    if (this.value === null) {
      return "";
    }
    if (typeof this.value === "number" && Number.isInteger(this.value)) {
      return this.value.toString() + ".0";
    }
    if (typeof this.value === "boolean") {
      return this.value ? "True" : "False";
    }
    return this.value.toString();
  }
}
