import { BaseField } from "./baseField";
import { StringDict } from "../../common";

export class SimpleField extends BaseField {
  readonly value: string | number | boolean | null;

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(serverResponse, indentLevel);
    this.value =
      serverResponse["value"] !== undefined ? (serverResponse["value"] as any) : null;
  }

  toString(): string {
    return this.value !== null && this.value !== undefined
      ? this.value.toString()
      : "";
  }
}
