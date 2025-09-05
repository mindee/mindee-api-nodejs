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
    return "Active Options" +
      "==============" +
      `:Raw Text: ${this.rawText}` +
      `:Polygon: ${this.polygon}` +
      `:Confidence: ${this.confidence}` +
      `:RAG: ${this.rag}`;
  }
}
