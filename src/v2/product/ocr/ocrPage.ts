import { OcrWord } from "./ocrWord.js";
import { StringDict } from "@/parsing/index.js";

export class OcrPage {
  /**
   * List of words extracted from the document page.
   */
  words: OcrWord[];

  /**
   * Full text content extracted from the document page.
   */
  content: string;

  constructor(serverResponse: StringDict) {
    this.words = (serverResponse["words"] as any[]).map(word => new OcrWord(word));
    this.content = serverResponse["content"] as string;
  }

  toString(): string {
    let ocrWords = "\n";
    if (this.words.length > 0) {
      ocrWords += this.words.map(word => word.toString()).join("\n\n");
    }
    let outStr = `OCR Words\n---------${ocrWords}`;
    outStr += `\n\n:Content: ${this.content}`;
    return outStr;
  }
}
