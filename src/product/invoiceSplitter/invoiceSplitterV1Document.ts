import { Inference, StringDict, cleanOutString } from "../../parsing/common";

import { PageGroup } from "./invoiceSplitterV1PageGroup";

/**
 * Document data for Invoice Splitter, API version 1.
 */
export class InvoiceSplitterV1Document extends Inference {
  /** List of page indexes that belong to the same invoice in the PDF. */
  invoicePageGroups: PageGroup[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    rawPrediction["invoice_page_groups"] &&
      rawPrediction["invoice_page_groups"].forEach((prediction: StringDict) =>
        this.invoicePageGroups.push(new PageGroup(prediction))
      );
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const invoicePageGroups: string = this.invoicePageGroups
      .map((item: PageGroup) => "\n  " + item.toString())
      .join("")
      .trimEnd();

    const outStr = `:Invoice Page Groups:${invoicePageGroups}`;
    return cleanOutString(outStr);
  }
}
