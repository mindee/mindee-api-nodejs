import {
  Inference,
  StringDict
} from "../../parsing/common";
import { CustomV1Document } from "./customV1Document";

export class CustomV1 extends Inference {
  endpointName = 'custom';
  endpointVersion = '1';
  prediction: CustomV1Document;

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new CustomV1Document(rawPrediction['document']);
  }
}
