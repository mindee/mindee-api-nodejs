import { AnnotatedFields } from "./annotatedFields.js";
import { StringDict } from "@/parsing/index.js";

/**
 * A RAG annotation enriched with field-level configuration.
 */
export class RagAnnotation {
  /**
   * A dictionary of field names and their corresponding configured field types.
   */
  public fields: AnnotatedFields;

  constructor(serverResponse: StringDict) {
    this.fields = new AnnotatedFields(serverResponse["fields"] ?? {});
  }
}
