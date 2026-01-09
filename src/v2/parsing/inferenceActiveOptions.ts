import { StringDict } from "@/parsing/stringDict.js";
import { DataSchemaActiveOption } from "./dataSchemaActiveOption.js";

export class InferenceActiveOptions {
  /**
   * Whether the RAG feature was activated.
   */
  public rag: boolean;
  /**
   * Whether the Raw Text feature was activated.
   */
  public rawText: boolean;
  /**
   * Whether the polygon feature was activated.
   */
  public polygon: boolean;
  /**
   * Whether the confidence feature was activated.
   */
  public confidence: boolean;

  /**
   * Whether the text context feature was activated.
   */
  public textContext: boolean;

  /**
   * Data schema options provided for the inference.
   */
  public dataSchema: DataSchemaActiveOption;

  constructor(serverResponse: StringDict) {
    this.rag = serverResponse["rag"];
    this.rawText = serverResponse["raw_text"];
    this.polygon = serverResponse["polygon"];
    this.confidence = serverResponse["confidence"];
    this.textContext = serverResponse["text_context"];
    this.dataSchema = new DataSchemaActiveOption(serverResponse["data_schema"]);
  }

  toString(): string {
    return "Active Options\n" +
      "==============\n" +
      `:Raw Text: ${this.rawText ? "True" : "False"}\n` +
      `:Polygon: ${this.polygon ? "True" : "False"}\n` +
      `:Confidence: ${this.confidence ? "True" : "False"}\n` +
      `:RAG: ${this.rag ? "True" : "False"}\n` +
      `:Text Context: ${this.textContext ? "True" : "False"}\n\n` +
      `${this.dataSchema}\n`;
  }
}
