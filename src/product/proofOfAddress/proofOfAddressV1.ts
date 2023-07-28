import { Inference, StringDict, Page } from "../../parsing/common";
import { ProofOfAddressV1Document } from "./proofOfAddressV1Document";

export class ProofOfAddressV1 extends Inference {
  endpointName = "proof_of_address";
  endpointVersion = "1";
  prediction: ProofOfAddressV1Document;
  pages: Page<ProofOfAddressV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new ProofOfAddressV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          ProofOfAddressV1Document,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
