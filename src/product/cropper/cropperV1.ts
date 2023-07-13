import { Inference, StringDict } from "../../parsing/common";
import { CropperV1Document } from "./cropperV1Document";

export class CropperV1 extends Inference {
  endpointName = 'cropper';
  endpointVersion = '1';
  prediction: CropperV1Document;

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new CropperV1Document(rawPrediction['document']);
  }
}
