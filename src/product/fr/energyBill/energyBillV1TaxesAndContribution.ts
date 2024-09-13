import { floatToString } from "../../../parsing/standard";
import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * Details of Taxes and Contributions.
 */
export class EnergyBillV1TaxesAndContribution {
  /** Description or details of the Taxes and Contributions. */
  description: string | undefined;
  /** The end date of the Taxes and Contributions. */
  endDate: string | undefined;
  /** The start date of the Taxes and Contributions. */
  startDate: string | undefined;
  /** The rate of tax applied to the total cost. */
  taxRate: number | undefined;
  /** The total cost of Taxes and Contributions. */
  total: number | undefined;
  /** The price per unit of Taxes and Contributions. */
  unitPrice: number | undefined;
  /** Confidence score */
  confidence: number = 0.0;
  /** The document page on which the information was found. */
  pageId: number;
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon = [];

  constructor({ prediction = {} }: StringDict) {
    this.description = prediction["description"];
    this.endDate = prediction["end_date"];
    this.startDate = prediction["start_date"];
    if (prediction["tax_rate"] && !isNaN(prediction["tax_rate"])) {
      this.taxRate = +parseFloat(prediction["tax_rate"]).toFixed(3);
    }
    if (prediction["total"] && !isNaN(prediction["total"])) {
      this.total = +parseFloat(prediction["total"]).toFixed(3);
    }
    if (prediction["unit_price"] && !isNaN(prediction["unit_price"])) {
      this.unitPrice = +parseFloat(prediction["unit_price"]).toFixed(3);
    }
    this.pageId = prediction["page_id"];
    this.confidence = prediction["confidence"] ? prediction.confidence : 0.0;
    if (prediction["polygon"]) {
      this.polygon = prediction.polygon;
    }
  }

  /**
   * Collection of fields as representable strings.
   */
  #printableValues() {
    return {
      description: this.description ?
        this.description.length <= 11 ?
          this.description :
          this.description.slice(0, 8) + "..." :
        "",
      endDate: this.endDate ?
        this.endDate.length <= 8 ?
          this.endDate :
          this.endDate.slice(0, 5) + "..." :
        "",
      startDate: this.startDate ?
        this.startDate.length <= 10 ?
          this.startDate :
          this.startDate.slice(0, 7) + "..." :
        "",
      taxRate: this.taxRate !== undefined ? floatToString(this.taxRate) : "",
      total: this.total !== undefined ? floatToString(this.total) : "",
      unitPrice: this.unitPrice !== undefined ? floatToString(this.unitPrice) : "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Description: " +
      printable.description +
      ", End Date: " +
      printable.endDate +
      ", Start Date: " +
      printable.startDate +
      ", Tax Rate: " +
      printable.taxRate +
      ", Total: " +
      printable.total +
      ", Unit Price: " +
      printable.unitPrice
    );
  }
  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.description.padEnd(11) +
      " | " +
      printable.endDate.padEnd(8) +
      " | " +
      printable.startDate.padEnd(10) +
      " | " +
      printable.taxRate.padEnd(8) +
      " | " +
      printable.total.padEnd(5) +
      " | " +
      printable.unitPrice.padEnd(10) +
      " |"
    );
  }
}
