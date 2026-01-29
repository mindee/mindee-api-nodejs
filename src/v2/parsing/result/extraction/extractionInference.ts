import { StringDict } from "@/parsing/stringDict.js";
import { ExtractionResult } from "./extractionResult.js";
import { ExtractionActiveOptions } from "./extractionActiveOptions.js";
import { BaseInference } from "@/v2/parsing/result/baseInference.js";

export class ExtractionInference extends BaseInference {
  /**
   * Result of the inference.
   */
  public result: ExtractionResult;
  /**
   * Active options for the inference.
   */
  public activeOptions: ExtractionActiveOptions;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.result = new ExtractionResult(serverResponse["result"]);
    this.activeOptions = new ExtractionActiveOptions(serverResponse["active_options"]);
  }

  toString(): string {
    return (
      "Inference\n" +
      "#########\n" +
      this.model.toString() + "\n" +
      this.file.toString() + "\n" +
      this.activeOptions.toString() + "\n" +
      this.result.toString() + "\n"
    );
  }
}
