import { AnnotatedBaseField } from "./annotatedBaseField.js";
import { StringDict } from "@/parsing/index.js";

/**
 * A SimpleField with additional configuration for annotation.
 */
export class AnnotatedSimpleField extends AnnotatedBaseField {
  /**
   * Field value, one of: string, boolean, number, null.
   */
  public value: string | boolean | number | null;

  /**
   * Default constructor.
   */
  constructor(serverResponse: StringDict) {
    super(serverResponse["selected"], serverResponse["guidelines"]);
    this.value = serverResponse["value"];
  }
}
