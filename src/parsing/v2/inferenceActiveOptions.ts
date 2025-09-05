import { StringDict } from "../common";

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

  constructor(serverResponse: StringDict) {
    this.rag = serverResponse["rag"];
    this.rawText = serverResponse["raw_text"];
    this.polygon = serverResponse["polygon"];
    this.confidence = serverResponse["confidence"];
  }

  toString(): string {
    return "Active Options\n" +
      "==============\n" +
      `:Raw Text: ${this.rawText ? "True" : "False"}\n` +
      `:Polygon: ${this.polygon ? "True" : "False"}\n` +
      `:Confidence: ${this.confidence ? "True" : "False"}\n` +
      `:RAG: ${this.rag ? "True" : "False"}\n`;
  }
}
