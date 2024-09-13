import { floatToString } from "../../../parsing/standard";
import { cleanSpaces } from "../../../parsing/common/summaryHelper";
import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * Detailed information about the pay.
 */
export class PayslipV2PayDetail {
  /** The gross salary of the employee. */
  grossSalary: number | undefined;
  /** The year-to-date gross salary of the employee. */
  grossSalaryYtd: number | undefined;
  /** The income tax rate of the employee. */
  incomeTaxRate: number | undefined;
  /** The income tax withheld from the employee's pay. */
  incomeTaxWithheld: number | undefined;
  /** The net paid amount of the employee. */
  netPaid: number | undefined;
  /** The net paid amount before tax of the employee. */
  netPaidBeforeTax: number | undefined;
  /** The net taxable amount of the employee. */
  netTaxable: number | undefined;
  /** The year-to-date net taxable amount of the employee. */
  netTaxableYtd: number | undefined;
  /** The total cost to the employer. */
  totalCostEmployer: number | undefined;
  /** The total taxes and deductions of the employee. */
  totalTaxesAndDeductions: number | undefined;
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
    if (prediction["gross_salary"] && !isNaN(prediction["gross_salary"])) {
      this.grossSalary = +parseFloat(prediction["gross_salary"]).toFixed(3);
    }
    if (prediction["gross_salary_ytd"] && !isNaN(prediction["gross_salary_ytd"])) {
      this.grossSalaryYtd = +parseFloat(prediction["gross_salary_ytd"]).toFixed(3);
    }
    if (prediction["income_tax_rate"] && !isNaN(prediction["income_tax_rate"])) {
      this.incomeTaxRate = +parseFloat(prediction["income_tax_rate"]).toFixed(3);
    }
    if (prediction["income_tax_withheld"] && !isNaN(prediction["income_tax_withheld"])) {
      this.incomeTaxWithheld = +parseFloat(prediction["income_tax_withheld"]).toFixed(3);
    }
    if (prediction["net_paid"] && !isNaN(prediction["net_paid"])) {
      this.netPaid = +parseFloat(prediction["net_paid"]).toFixed(3);
    }
    if (prediction["net_paid_before_tax"] && !isNaN(prediction["net_paid_before_tax"])) {
      this.netPaidBeforeTax = +parseFloat(prediction["net_paid_before_tax"]).toFixed(3);
    }
    if (prediction["net_taxable"] && !isNaN(prediction["net_taxable"])) {
      this.netTaxable = +parseFloat(prediction["net_taxable"]).toFixed(3);
    }
    if (prediction["net_taxable_ytd"] && !isNaN(prediction["net_taxable_ytd"])) {
      this.netTaxableYtd = +parseFloat(prediction["net_taxable_ytd"]).toFixed(3);
    }
    if (prediction["total_cost_employer"] && !isNaN(prediction["total_cost_employer"])) {
      this.totalCostEmployer = +parseFloat(prediction["total_cost_employer"]).toFixed(3);
    }
    if (prediction["total_taxes_and_deductions"] && !isNaN(prediction["total_taxes_and_deductions"])) {
      this.totalTaxesAndDeductions = +parseFloat(prediction["total_taxes_and_deductions"]).toFixed(3);
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
      grossSalary:
        this.grossSalary !== undefined ? floatToString(this.grossSalary) : "",
      grossSalaryYtd:
        this.grossSalaryYtd !== undefined ? floatToString(this.grossSalaryYtd) : "",
      incomeTaxRate:
        this.incomeTaxRate !== undefined ? floatToString(this.incomeTaxRate) : "",
      incomeTaxWithheld:
        this.incomeTaxWithheld !== undefined ? floatToString(this.incomeTaxWithheld) : "",
      netPaid: this.netPaid !== undefined ? floatToString(this.netPaid) : "",
      netPaidBeforeTax:
        this.netPaidBeforeTax !== undefined ? floatToString(this.netPaidBeforeTax) : "",
      netTaxable:
        this.netTaxable !== undefined ? floatToString(this.netTaxable) : "",
      netTaxableYtd:
        this.netTaxableYtd !== undefined ? floatToString(this.netTaxableYtd) : "",
      totalCostEmployer:
        this.totalCostEmployer !== undefined ? floatToString(this.totalCostEmployer) : "",
      totalTaxesAndDeductions:
        this.totalTaxesAndDeductions !== undefined ? floatToString(this.totalTaxesAndDeductions) : "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Gross Salary: " +
      printable.grossSalary +
      ", Gross Salary YTD: " +
      printable.grossSalaryYtd +
      ", Income Tax Rate: " +
      printable.incomeTaxRate +
      ", Income Tax Withheld: " +
      printable.incomeTaxWithheld +
      ", Net Paid: " +
      printable.netPaid +
      ", Net Paid Before Tax: " +
      printable.netPaidBeforeTax +
      ", Net Taxable: " +
      printable.netTaxable +
      ", Net Taxable YTD: " +
      printable.netTaxableYtd +
      ", Total Cost Employer: " +
      printable.totalCostEmployer +
      ", Total Taxes and Deductions: " +
      printable.totalTaxesAndDeductions
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Gross Salary: ${printable.grossSalary}
  :Gross Salary YTD: ${printable.grossSalaryYtd}
  :Income Tax Rate: ${printable.incomeTaxRate}
  :Income Tax Withheld: ${printable.incomeTaxWithheld}
  :Net Paid: ${printable.netPaid}
  :Net Paid Before Tax: ${printable.netPaidBeforeTax}
  :Net Taxable: ${printable.netTaxable}
  :Net Taxable YTD: ${printable.netTaxableYtd}
  :Total Cost Employer: ${printable.totalCostEmployer}
  :Total Taxes and Deductions: ${printable.totalTaxesAndDeductions}`.trimEnd();
  }
}
