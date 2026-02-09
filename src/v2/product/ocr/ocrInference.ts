import { StringDict } from "@/parsing/index.js";
import { BaseInference } from "@/v2/parsing/inference/baseInference.js";
import { OcrResult } from "@/v2/product/ocr/ocrResult.js";

export class OcrInference extends BaseInference {
  /**
   * Result of an OCR inference.
   */
  result: OcrResult;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.result = new OcrResult(serverResponse["result"]);
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
