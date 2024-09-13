import { cleanSpaces } from "../../parsing/common/summaryHelper";
import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * The list of social network profiles of the candidate.
 */
export class ResumeV1SocialNetworksUrl {
  /** The name of the social network. */
  name: string | undefined;
  /** The URL of the social network. */
  url: string | undefined;
  /** Confidence score */
  confidence: number = 0.0;
  /** The document page on which the information was found. */
  pageId: number;
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon = [];

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
          cleanSpaces(this.name) :
          cleanSpaces(this.name).slice(0, 17) + "..." :
        "",
      url: this.url ?
        this.url.length <= 50 ?
          cleanSpaces(this.url) :
          cleanSpaces(this.url).slice(0, 47) + "..." :
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
