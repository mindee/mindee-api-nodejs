import { Field } from "./field";
import { BaseFieldConstructor } from "./base";
import { cleanOutString } from "../common";

/**
 * A company registration item.
 */
export class CompanyRegistrationField extends Field {
  /** Registration identifier. */
  value?: string;
  /** Type of company registration. */
  type: string;

  constructor({
    prediction = {},
    valueKey = "value",
    reconstructed = false,
    pageId,
  }: BaseFieldConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });
    this.type = prediction["type"];
  }
  toTableLine(): string {
    const printable = this.printableValues();
    return `| ${printable["type"].padEnd(15)} | ${printable["value"].padEnd(20)} `;
  }
  toString(): string {
    const printable = this.printableValues();
    return `Type: ${printable["type"]}, Value: ${printable["value"]}`;
  }
  private printableValues(): { [key: string]: string } {
    const printable: { [key: string]: string } = {};
    printable["type"] = cleanOutString(this.type);
    printable["value"] = cleanOutString((this.value ?? "").toString());
    return printable;
  }

}
