import { Inference, StringDict, cleanOutString } from "../../parsing/common";

import { PageGroup } from "./invoiceSplitterV1PageGroup";

export class InvoiceSplitterV1Document extends Inference {
  /** List of page indexes that belong to the same invoice in the PDF. */
  invoicePageGroups: PageGroup[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    rawPrediction["invoice_page_groups"] &&
      rawPrediction["invoice_page_groups"].map((prediction: StringDict) =>
        this.invoicePageGroups.push(new PageGroup(prediction))
      );
  }

  toString(): string {
    const invoicePageGroups: string = this.invoicePageGroups
      .map((item: PageGroup) => "\n  " + item.toString())
      .join("")
      .trimEnd();

    const outStr = `:Invoice Page Groups:${invoicePageGroups}`;
    return cleanOutString(outStr);
  }
}
