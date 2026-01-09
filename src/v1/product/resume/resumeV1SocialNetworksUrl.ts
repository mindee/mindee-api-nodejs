
import { cleanSpecialChars } from "@/v1/parsing/common/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * The list of social network profiles of the candidate.
 */
export class ResumeV1SocialNetworksUrl {
  /** The name of the social network. */
  name: string | null;
  /** The URL of the social network. */
  url: string | null;
  /** Confidence score */
  confidence: number = 0.0;
  /** The document page on which the information was found. */
  pageId: number;
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon = new Polygon();

  constructor({ prediction = {} }: StringDict) {
    this.name = prediction["name"];
    this.url = prediction["url"];
    this.pageId = prediction["page_id"];
    this.confidence = prediction["confidence"] ? prediction.confidence : 0.0;
    if (prediction["polygon"]) {
      this.polygon = prediction.polygon;
    }
  }

  /**
   * Collection of fields as representable strings.
   */
  #printableValues() {
    return {
      name: this.name ?
        this.name.length <= 20 ?
          cleanSpecialChars(this.name) :
          cleanSpecialChars(this.name).slice(0, 17) + "..." :
        "",
      url: this.url ?
        this.url.length <= 50 ?
          cleanSpecialChars(this.url) :
          cleanSpecialChars(this.url).slice(0, 47) + "..." :
        "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Name: " +
      printable.name +
      ", URL: " +
      printable.url
    );
  }

  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.name.padEnd(20) +
      " | " +
      printable.url.padEnd(50) +
      " |"
    );
  }
}
