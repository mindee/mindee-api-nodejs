import { Inference, Page, StringDict } from "../../parsing/common";
import { CropperV1Document } from "./cropperV1Document";

export class CropperV1 extends Inference {
  endpointName = 'cropper';
  endpointVersion = '1';
  prediction?: CropperV1Document;

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = rawPrediction.hasOwnProperty("prediction") ? new CropperV1Document(rawPrediction["prediction"]) : undefined;
    this.pages = rawPrediction.hasOwnProperty("pages") ? rawPrediction["pages"].map((page: StringDict) => new Page<CropperV1Document>(CropperV1Document, page["prediction"], page["id"], page["orientation"])) : undefined;
  }
}
