import { StringDict } from "@/parsing/index.js";
import { BaseInference } from "@/v2/parsing/result/baseInference.js";

export class OcrInference extends BaseInference {
  /**
   * Result of an OCR inference.
   */
  result: any;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.result = serverResponse["result"];
  }

  toString(): string {
    return (
      "Inference\n" +
      "#########\n" +
      this.model.toString() + "\n" +
      this.file.toString() + "\n" +
      this.result.toString() + "\n"
    );
  }
}
