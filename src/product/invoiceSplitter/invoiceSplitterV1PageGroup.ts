import { StringDict } from "../../parsing/common";

export class PageGroup {
  pageIndexes: number[] = [];
  confidence: number;

  constructor(prediction: StringDict) {
    this.pageIndexes = prediction.page_indexes;
    this.confidence = prediction["confidence"];
  }

  toString(): string {
    return `:Page indexes: ${this.pageIndexes.join(", ")}`;
  }
}
