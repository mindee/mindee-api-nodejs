import {
  StringDict,
} from "../../parsing/common";
import { CustomV1Document } from "./customV1Document";

export class CustomV1Page extends CustomV1Document {
  constructor(rawPrediction: StringDict, pageId?: number) {
    super(rawPrediction, pageId);
  }
}
