import { Inference, StringDict } from "../../parsing/common";
import { MindeeVisionV1Document } from "./mindeeVisionV1Document";

export class MindeeVisionV1 extends Inference {
  endpointName ='mindee_vision';
  endpointVersion = '1';  
  prediction: MindeeVisionV1Document;

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new MindeeVisionV1Document(rawPrediction['document']);
  }
}
