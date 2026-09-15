import { AnnotatedBaseField } from "./annotatedBaseField.js";

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
   * @param value Field value, one of: string, boolean, number, null.
   * @param selected When true, use the RAG information for the final result.
   *  When false, use the Data Schema information.
   * @param guidelines Guidelines or instructions for processing this field.
   */
  constructor(
    value: string | boolean | number | null,
    selected: boolean,
    guidelines: string
  ) {
    super(selected, guidelines);
    this.value = value;
  }
}
