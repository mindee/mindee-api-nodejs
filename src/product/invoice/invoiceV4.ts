import {
  Inference,
  StringDict,
  Page
} from "../../parsing/common";
import { InvoiceV4Document } from "./invoiceV4Document";

export class InvoiceV4 extends Inference {
  endpointName ='invoices';
  endpointVersion = '4';
  prediction?: InvoiceV4Document;

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = rawPrediction.hasOwnProperty("prediction") ? new InvoiceV4Document(rawPrediction["prediction"]) : undefined;
    this.pages = rawPrediction.hasOwnProperty("pages") ? rawPrediction["pages"].map((page: StringDict) => new Page<InvoiceV4Document>(InvoiceV4Document, page["prediction"], page["id"], page["orientation"])) : undefined;
  }
}
