import { Document, DocumentConstructorProps } from "../../parsing/common";
import { StringDict } from "../../parsing/standard";

export class PageGroup {
  pageIndexes: number[] = [];
  confidence: number;

  constructor(prediction: StringDict) {
    this.pageIndexes = prediction.page_indexes;
    this.confidence = prediction.confidence;
  }

  toString(): string {
    return `page indexes: ${this.pageIndexes.join(", ")}`;
  }
}

export class InvoiceSplitterV1 extends Document {
  /** List of page indexes that belong to the same invoice in the PDF. */
  invoicePageGroups: PageGroup[] = [];

  constructor({
    prediction,
    orientation = undefined,
    extras = undefined,
    inputSource = undefined,
    fullText = undefined,
    pageId = undefined,
  }: DocumentConstructorProps) {
    super({
      inputSource: inputSource,
      pageId: pageId,
      orientation: orientation,
      fullText: fullText,
      extras: extras,
    });
    if (prediction.invoice_page_groups !== undefined) {
      prediction.invoice_page_groups.map((prediction: StringDict) =>
        this.invoicePageGroups.push(new PageGroup(prediction))
      );
    }
  }

  toString(): string {
    let invoicePageGroups = "\n";
    if (this.invoicePageGroups.length > 0) {
      invoicePageGroups = "\n  ";
      invoicePageGroups += this.invoicePageGroups
        .map((item) => item.toString())
        .join("\n  ");
    }

    const outStr = `----- Invoice Splitter V1 -----
Filename: ${this.filename}
Invoice Page Groups: ${invoicePageGroups}
----------------------
`;
    return InvoiceSplitterV1.cleanOutString(outStr);
  }
}