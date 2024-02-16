import { Inference, StringDict, Page } from "../../parsing/common";
import { ProofOfAddressV1Document } from "./proofOfAddressV1Document";

/**
 * Inference prediction for Proof of Address, API version 1.
 */
export class ProofOfAddressV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "proof_of_address";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: ProofOfAddressV1Document;
  /** The document's pages. */
  pages: Page<ProofOfAddressV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new ProofOfAddressV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            ProofOfAddressV1Document,
            page,
            page["id"],
            page["orientation"]
          ))
        }
      }
    );
  }
}
