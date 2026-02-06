import { InferenceFields } from "@/v2/parsing/inference/field/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { RawText } from "@/v2/parsing/inference/field/rawText.js";
import { RagMetadata } from "@/v2/parsing/inference/field/ragMetadata.js";

export class ExtractionResult {
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
