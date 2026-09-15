/**
 * Base class for annotated fields.
 */
export abstract class AnnotatedBaseField {
  /**
   * When true, use the RAG information for the final result. When false, use the Data Schema information.
   */
  public selected: boolean;

  /**
   * Guidelines or instructions for processing this field.
   */
  public guidelines: string;

  /**
   * Default constructor.
   * @param selected When true, use the RAG information for the final result.
   *  When false, use the Data Schema information.
   * @param guidelines Guidelines or instructions for processing this field.
   */
  protected constructor(selected: boolean, guidelines: string) {
    this.selected = selected;
    this.guidelines = guidelines;
  }
}
