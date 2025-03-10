import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "../../parsing/common";
import { InvoiceSplitterV1InvoicePageGroup } from "./invoiceSplitterV1InvoicePageGroup";


/**
 * Invoice Splitter API version 1.2 document data.
 */
export class InvoiceSplitterV1Document implements Prediction {
  /** List of page groups. Each group represents a single invoice within a multi-invoice document. */
  invoicePageGroups: InvoiceSplitterV1InvoicePageGroup[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    rawPrediction["invoice_page_groups"] &&
      rawPrediction["invoice_page_groups"].map(
        (itemPrediction: StringDict) =>
          this.invoicePageGroups.push(
            new InvoiceSplitterV1InvoicePageGroup({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
  }

  /**
   * Default string representation.
   */
  toString(): string {
    let invoicePageGroupsSummary:string = "";
    if (this.invoicePageGroups && this.invoicePageGroups.length > 0) {
      const invoicePageGroupsColSizes:number[] = [74];
      invoicePageGroupsSummary += "\n" + lineSeparator(invoicePageGroupsColSizes, "-") + "\n  ";
      invoicePageGroupsSummary += "| Page Indexes                                                             ";
      invoicePageGroupsSummary += "|\n" + lineSeparator(invoicePageGroupsColSizes, "=");
      invoicePageGroupsSummary += this.invoicePageGroups.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(invoicePageGroupsColSizes, "-")
      ).join("");
    }
    const outStr = `:Invoice Page Groups: ${invoicePageGroupsSummary}`.trimEnd();
    return cleanOutString(outStr);
  }
}
