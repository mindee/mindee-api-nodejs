import { StringDict } from "../../common";
import { DynamicField } from "./dynamicField";

export class SimpleField extends DynamicField {
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
