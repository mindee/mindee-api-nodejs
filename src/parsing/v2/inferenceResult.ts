import { InferenceFields } from "./field";
import { StringDict } from "../common";
import { RawText } from "./rawText";
import { RagMetadata } from "./ragMetadata";

export class InferenceResult {
  /**
   * Fields contained in the inference.
   */
  public fields: InferenceFields;

  /**
   * Raw text extracted from all pages.
   */
  public rawText?: RawText;

  /**
   * RAG metadata.
   */
  public rag?: RagMetadata;

  constructor(serverResponse: StringDict) {
    this.fields = new InferenceFields(serverResponse["fields"]);
    if (serverResponse["raw_text"]) {
      this.rawText = new RawText(serverResponse["raw_text"]);
    }
    if (serverResponse["rag"]) {
      this.rag = new RagMetadata(serverResponse["rag"]);
    }
  }

  toString(): string {
    return `Fields\n======\n${this.fields}`;
  }
}
