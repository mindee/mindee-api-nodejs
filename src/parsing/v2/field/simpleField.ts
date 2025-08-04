import { StringDict } from "../../common";
import { BaseField } from "./baseField";

export class SimpleField extends BaseField {
  readonly value: string | number | boolean | null;

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(serverResponse, indentLevel);
    this.value =
      serverResponse["value"] !== undefined ? (serverResponse["value"] as any) : null;
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
