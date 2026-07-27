import { StringDict } from "@/parsing/stringDict.js";

/**
 * Data schema options activated during the inference.
 */
export class DataSchemaActiveOption {
  /**
   * Whether to replace the data schema.
   */
  replace: boolean;

  constructor(serverResponse: StringDict) {
    this.replace = serverResponse["replace"];
  }

  /** Returns a readable representation of active data schema options. */
  toString() {
    return `Data Schema\n-----------\n:Replace: ${this.replace? "True" : "False"}`;
  }
}
