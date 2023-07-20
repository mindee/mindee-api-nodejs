import {
  Inference,
  Page,
  StringDict
} from "../../parsing/common";
import { CustomV1Document } from "./customV1Document";
import { CustomV1Page } from "./customV1Page";

export class CustomV1 extends Inference {
  endpointName = 'custom';
  endpointVersion = '1';
  prediction?: CustomV1Document;

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = rawPrediction.hasOwnProperty("prediction") ? new CustomV1Document(rawPrediction['prediction']) : undefined;
    this.pages = rawPrediction.hasOwnProperty("pages") ? rawPrediction["pages"].map((page: StringDict) => new Page(CustomV1Page, page["prediction"], page["id"], page["orientation"])) : [];
  }
}
